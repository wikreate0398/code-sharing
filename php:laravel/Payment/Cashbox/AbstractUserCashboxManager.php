<?php

namespace App\Services\User\Payment\Cashbox;

use App\Enum\CashboxActionEnum;
use App\Events\Cashbox\StoreCashboxEvent;
use App\Models\User;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\PaymentLogger;
use App\Services\User\Payment\Logger\RewriteLogger;
use App\Services\User\Payment\Logger\Services\PaymentLogServiceInterface;
use App\Services\User\Payment\PaymentManager;

abstract class AbstractUserCashboxManager
{
    protected $cashbox;

    /**
     * @var AbstractCashbox
     */
    protected $cashboxManager;

    /**
     * @var User
     */
    protected $user;

    public function __construct(
        protected PaymentLogger $logger
    ) {}

    /**
     * @param  User  $user
     * @return $this
     */
    public function user(User $user)
    {
        $this->user = $user;
        return $this;
    }

    protected function setCashbox($cashbox)
    {
        $this->cashbox = $cashbox;
    }

    /**
     * @param  float  $amount
     * @return User
     */
    public function charge(float $amount): User
    {
        $updatedUser = $this->cashboxManager->charge($this->user, $amount);

        $this->logger->user($updatedUser)
                     ->amount($amount)
                     ->charge();

        event(new StoreCashboxEvent($this->cashbox, $updatedUser, $amount, CashboxActionEnum::CHARGE));

        return $updatedUser;
    }

    /**
     * @param  float  $amount
     * @return User
     */
    public function extract(float $amount): User
    {
        $updatedUser = $this->cashboxManager->extract($this->user, $amount);
        $this->logger->user($updatedUser)
                     ->amount($amount)
                     ->extract();

        event(new StoreCashboxEvent($this->cashbox, $updatedUser, $amount, CashboxActionEnum::EXTRACT));

        return $updatedUser;
    }

    /**
     * @param float $amount
     * @param PaymentManager $paymentManager
     * @param callable(RewriteLogger): void|null $handleChargeLog
     * @param callable(RewriteLogger): void|null $handleExtractLog
     * @return void
     */
    public function rewrite(
        float $amount,
        PaymentManager $paymentManager,
        callable $handleChargeLog = null,
        callable $handleExtractLog = null
    ): void
    {
        $user = $this->user;
        $field = $this->cashboxManager->getField();
        $currentAmount = $user->{$field};

        $logger = new RewriteLogger();
        if ($amount > $currentAmount) {
            $chargeAmount = $amount - $currentAmount;
            $paymentManager->charge($chargeAmount);

            if (is_callable($handleChargeLog)) {
                $handleChargeLog($logger);
            }
        } else {
            $extractAmount = $currentAmount - $amount;
            $paymentManager->extract($extractAmount);
            if (is_callable($handleExtractLog)) {
                $handleExtractLog($logger);
            }
        }

        if ($logger->getLoggerService()) {
            $paymentManager->log($logger->getLoggerService(), [], $logger->getLogOptionsHandler());
        }
    }

    /**
     * @param User $admin
     * @return $this
     */
    public function admin(?User $admin)
    {
        $this->logger->admin($admin);
        return $this;
    }

    /**
     * @param  string|PaymentLogServiceInterface  $loggerService
     * @param  array  $params
     * @param  callable|null  $callback
     */
    public function log(PaymentActionEnum|PaymentLogServiceInterface $loggerService, $params = [], callable $callback = null)
    {
        if (is_callable($callback)) {
            $callback($this->logger->getHistoryInfo());
        }

        $this->logger->log($loggerService, $params);
    }
}