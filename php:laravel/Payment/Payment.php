<?php

namespace App\Services\User\Payment;

use App\Models\User;
use Illuminate\Support\Facades\Facade;

/**
 * @method static PaymentManager cashbox($type, User $user)
 * @method static PaymentManager dispatch(\Closure $clbck)
 * @method static PaymentManager ballanceCashbox(User $user)
 * @method static PaymentManager depositCashbox(User $user)
 * @method static PaymentManager penaltyCashbox(User $user)
 * @method static PaymentManager purchaseLimitCashbox(User $user)
 *
 * @see PaymentManager
 */

class Payment extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        self::clearResolvedInstance(PaymentManager::class);
        return PaymentManager::class;
    }
}