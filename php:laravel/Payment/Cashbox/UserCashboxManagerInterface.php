<?php

namespace App\Services\User\Payment\Cashbox;

use App\Models\User;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\RewriteLogger;
use App\Services\User\Payment\Logger\Services\PaymentLogServiceInterface;
use App\Services\User\Payment\PaymentManager;

/**
 * @see CustomerCashboxManager
 * @see SupplierCashboxManager
 */
interface UserCashboxManagerInterface
{
    /**
     * @param  User  $user
     * @return $this
     */
    public function user(User $user);

    /**
     * @param  User  $admin
     * @return $this
     */
    public function admin(?User $admin);

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
    ): void;

    /**
     * @param  string|PaymentLogServiceInterface  $loggerService
     * @param  array  $params
     * @param  callable|null  $callback
     * @return mixed
     */
    public function log(PaymentActionEnum|PaymentLogServiceInterface $loggerService, $params = [], callable $callback = null);
}