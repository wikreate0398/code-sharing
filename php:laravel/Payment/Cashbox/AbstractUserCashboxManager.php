<?php

namespace App\Services\User\Payment\Cashbox;

use App\Models\User;
use App\Services\User\Payment\Logger\PaymentLogger;
use App\Services\User\Payment\Logger\Services\PaymentLogServiceInterface;

abstract class AbstractUserCashboxManager
{
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

    /**
     * @param  float  $amount
     * @return User
     */
    public function charge(float $amount): User
    {
        $updatedUser = $this->cashboxManager->charge($this->user, $amount);
        $this->logger->user($updatedUser)->amount($amount)->charge();
        return $updatedUser;
    }

    /**
     * @param  float  $amount
     * @return User
     */
    public function extract(float $amount): User
    {
        $updatedUser = $this->cashboxManager->extract($this->user, $amount);
        $this->logger->user($updatedUser)->amount($amount)->extract();
        return $updatedUser;
    }

    /**
     * @param  string|PaymentLogServiceInterface  $loggerService
     * @param  array  $params
     * @param  callable|null  $callback
     */
    public function log(string|PaymentLogServiceInterface $loggerService, $params = [], callable $callback = null)
    {
        if (is_callable($callback)) {
            $callback($this->logger->getHistoryInfo());
        }

        $this->logger->log($loggerService, $params);
    }
}