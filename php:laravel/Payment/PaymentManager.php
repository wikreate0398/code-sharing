<?php

namespace App\Services\User\Payment;

use App\Http\Controllers\Traits\TransactionDB;
use App\Models\User;
use App\Services\User\Payment\Cashbox\CustomerCashboxManager;
use App\Services\User\Payment\Cashbox\SupplierCashboxManager;
use App\Services\User\Payment\Cashbox\UserCashboxManagerInterface;
use App\Services\User\Payment\Logger\Services\PaymentLogServiceInterface;

class PaymentManager
{
    use TransactionDB;

    /**
     * @var User
     */
    private $updatedUser;

    /**
     * @var UserCashboxManagerInterface
     */
    private $userCashBoxManager;

    /**
     * @param callable($this): void $callback
     * @param  int  $steps
     */
    public function openTransaction(callable $callback, $steps = 1)
    {
        $this->transaction(fn () => $callback($this), $steps);
    }

    /**
     * @param  User  $user
     * @param  string  $cashbox
     * @return $this
     */
    private function init(User $user, string $cashbox)
    {
        $this->userCashBoxManager = app(
            $user->isClient() ? CustomerCashboxManager::class : SupplierCashboxManager::class
        );
        $this->userCashBoxManager->user($user)->cashbox($cashbox);

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
            'ballance' => $this->ballanceCashbox($user),
            'deposit'  => $this->depositCashbox($user),
            'penalty'  => $this->penaltyCashbox($user)
        };
    }

    /**
     * @return $this
     */
    public function ballanceCashbox(User $user)
    {
        $this->init($user, 'ballance');
        return $this;
    }

    /**
     * @return $this
     */
    public function depositCashbox(User $user)
    {
        $this->init($user, 'deposit');
        return $this;
    }

    /**
     * @return $this
     */
    public function penaltyCashbox(User $user = null)
    {
        $this->init($user, 'penalty');
        return $this;
    }

    /**
     * @param  float  $amount
     * @return $this
     */
    public function charge(float $amount)
    {
        $this->updatedUser = $this->userCashBoxManager->charge($amount);
        return $this;
    }

    /**
     * @param  float  $amount
     * @return $this
     */
    public function extract(float $amount)
    {
        $this->updatedUser = $this->userCashBoxManager->extract($amount);
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
     * @param  string|PaymentLogServiceInterface  $loggerService
     * @param  callable|null  $callback
     * @return $this
     */
    public function log(string|PaymentLogServiceInterface $loggerService, $params = [], callable $callback = null)
    {
        $this->userCashBoxManager->log($loggerService, $params, $callback);
        return $this;
    }
}