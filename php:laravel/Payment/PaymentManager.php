<?php

namespace App\Services\User\Payment;

use App\Enum\CashboxActionEnum;
use App\Enum\PaymentMiddlewareTypeEnum;
use App\Http\Controllers\Traits\TransactionDB;
use App\Models\User;
use App\Repository\Interfaces\UserRepositoryInterface;
use App\Services\User\Payment\Cashbox\CustomerCashboxManager;
use App\Services\User\Payment\Cashbox\SupplierCashboxManager;
use App\Services\User\Payment\Cashbox\UserCashboxManagerInterface;
use App\Services\User\Payment\Enums\CashboxEnum;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\RewriteLogger;
use App\Services\User\Payment\Logger\Services\PaymentLogServiceInterface;
use App\Services\User\Payment\Middleware\Core\PaymentMiddlewareDto;
use App\Services\User\Payment\Middleware\Core\PaymentMiddlewareManager;
use App\Services\User\Payment\Middleware\Interfaces\AfterTransaction;
use App\Services\User\Payment\Middleware\Interfaces\BeforeTransaction;
use Illuminate\Support\Facades\DB;

class PaymentManager
{
    use TransactionDB;

    /**
     * @var User
     */
    private $user;

    /**
     * @var CashboxEnum
     */
    private $cashbox;

    /**
     * @var User
     */
    private $updatedUser;

    /**
     * @var UserCashboxManagerInterface
     */
    private $userCashBoxManager;

    protected $dispatchMode = false;

    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected PaymentMiddlewareManager $middleware,
        $dispatchMode = false
    )
    {
        $this->dispatchMode = $dispatchMode;
    }

    public static function dispatch(\Closure $clbck)
    {
        dispatch(function () use ($clbck) {
            DB::transaction(function () use ($clbck) {
                $clbck(app(self::class, ['dispatchMode' => true]));
            }, 3);
        })->afterCommit();
    }

    /**
     * @param BeforeTransaction|BeforeTransaction[] $middleware
     * @return $this
     */
    public function beforeMiddleware(array|BeforeTransaction $middlewares): self
    {
        $this->middleware->addBeforeTransaction(PaymentMiddlewareTypeEnum::BEFORE_TRANSACTION, $middlewares);
        return $this;
    }

    /**
     * @param AfterTransaction|AfterTransaction[] $middlewares
     * @return $this
     */
    public function afterMiddleware(array|AfterTransaction $middlewares): self
    {
        $this->middleware->addAfterTransaction(PaymentMiddlewareTypeEnum::AFTER_TRANSACTION, $middlewares);
        return $this;
    }

    /**
     * @param  User $user
     * @param  string $cashbox
     * @return $this
     */
    private function init(User $user, CashboxEnum $cashbox): self
    {
        $user = $this->userRepository->find($user->id, true, true);

        $this->user    = $user;
        $this->cashbox = $cashbox;

        $this->userCashBoxManager = app(
            $user->isClientGate() ? CustomerCashboxManager::class : SupplierCashboxManager::class
        );

        $this->userCashBoxManager->user($user)->cashbox($cashbox->value);

        return $this;
    }

    /**
     * @param  string  $type
     * @param  User  $user
     * @return $this
     */
    public function cashbox(string $type, User $user)
    {
        return match ($type) {
            CashboxEnum::BALLANCE->value       => $this->ballanceCashbox($user),
            CashboxEnum::DEPOSIT->value        => $this->depositCashbox($user),
            CashboxEnum::PENALTY->value        => $this->penaltyCashbox($user),
            CashboxEnum::PURCHASE_LIMIT->value => $this->purchaseLimitCashbox($user)
        };
    }

    /**
     * @return $this
     */
    public function ballanceCashbox(User $user): self
    {
        return $this->init($user, CashboxEnum::BALLANCE);
    }

    /**
     * @return $this
     */
    public function depositCashbox(User $user): self
    {
        return $this->init($user, CashboxEnum::DEPOSIT);
    }

    /**
     * @return $this
     */
    public function penaltyCashbox(User $user = null): self
    {
        return $this->init($user, CashboxEnum::PENALTY);
    }

    /**
     * @return $this
     */
    public function purchaseLimitCashbox(User $user = null): self
    {
        return $this->init($user, CashboxEnum::PURCHASE_LIMIT);
    }

    /**
     * @param  float  $amount
     * @return $this
     */
    public function charge(float $amount)
    {
        $user = $this->middleware->apply(
            PaymentMiddlewareTypeEnum::BEFORE_TRANSACTION,
            PaymentMiddlewareDto::transform([
                'amount'  => $amount,
                'action'  => CashboxActionEnum::CHARGE,
                ...$this->mdlwrDtoProps()
            ]),
            function (PaymentMiddlewareDto $dto) {
                return $this->userCashBoxManager->charge($dto->amount);
            }
        );

        $this->updatedUser = $this->middleware->apply(
            PaymentMiddlewareTypeEnum::AFTER_TRANSACTION,
            PaymentMiddlewareDto::transform([
                'amount'  => $amount,
                'action'  => CashboxActionEnum::CHARGE,
                ...$this->mdlwrDtoProps($user)
            ]),
            function (PaymentMiddlewareDto $dto) {
                return $dto->user;
            }
        );

        return $this;
    }

    /**
     * @param  float  $amount
     * @return $this
     */
    public function extract(float $amount)
    {
        $user = $this->middleware->apply(
            PaymentMiddlewareTypeEnum::BEFORE_TRANSACTION,
            PaymentMiddlewareDto::transform([
                'amount'  => $amount,
                'action'  => CashboxActionEnum::EXTRACT,
                ...$this->mdlwrDtoProps()
            ]),
            function (PaymentMiddlewareDto $dto) {
                return $this->userCashBoxManager->extract($dto->amount);
            }
        );

        $this->updatedUser = $this->middleware->apply(
            PaymentMiddlewareTypeEnum::AFTER_TRANSACTION,
            PaymentMiddlewareDto::transform([
                'amount'  => $amount,
                'action'  => CashboxActionEnum::EXTRACT,
                ...$this->mdlwrDtoProps($user)
            ]),
            function (PaymentMiddlewareDto $dto) {
                return $dto->user;
            }
        );

        return $this;
    }

    /**
     * @param float $amount
     * @param callable(RewriteLogger): void|null $handleChargeLog
     * @param callable(RewriteLogger): void|null $handleExtractLog
     * @return $this
     */
    public function rewrite(float $amount, \Closure $handleChargeLog = null, \Closure $handleExtractLog = null)
    {
        $this->userCashBoxManager->rewrite($amount, $this, $handleChargeLog, $handleExtractLog);

        return $this;
    }

    private function mdlwrDtoProps(User $user = null)
    {
        return [
            'cashbox' => $this->cashbox,
            'user'    => $user ?: $this->user
        ];
    }

    /**
     * @param User $admin
     * @return $this
     */
    public function admin(?User $admin)
    {
        $this->userCashBoxManager->admin($admin);
        return $this;
    }

    /**
     * @return User
     */
    public function getUpdatedUser()
    {
        return $this->updatedUser;
    }

    /**
     * @param  PaymentActionEnum|PaymentLogServiceInterface  $loggerService
     * @param  callable|null  $callback
     * @return $this
     */
    public function log(PaymentActionEnum|PaymentLogServiceInterface $loggerService, $params = [], callable $callback = null)
    {
        $this->userCashBoxManager->log($loggerService, $params, $callback);
        return $this;
    }
}