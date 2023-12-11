<?php

namespace App\Services\User\Payment\Cashbox;

use App\Models\User;
use App\Services\User\Payment\Logger\Services\PaymentLogServiceInterface;

interface UserCashboxManagerInterface
{
    /**
     * @param  User  $user
     * @return mixed
     */
    public function user(User $user);

    /**
     * @param  string  $cashbox
     * @return mixed
     */
    public function cashbox(string $cashbox);

    /**
     * @param  float  $amount
     * @return User
     */
    public function charge(float $amount): User;

    /**
     * @param  float  $amount
     * @return User
     */
    public function extract(float $amount): User;

    /**
     * @param  string|PaymentLogServiceInterface  $loggerService
     * @param  array  $params
     * @param  callable|null  $callback
     * @return mixed
     */
    public function log(string|PaymentLogServiceInterface $loggerService, $params = [], callable $callback = null);
}