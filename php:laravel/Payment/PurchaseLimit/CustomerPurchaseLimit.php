<?php

namespace App\Services\User\Payment\PurchaseLimit;

use App\Dto\P2p\RecalculateP2pPurchaseLimitDto;
use App\Models\User;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use Illuminate\Support\Facades\Facade;

/**
 * @method static PurchaseLimitManager withCtx(array $ctx = [])
 * @method static User extractOnPurchase(User $user, $amount, $discount = false)
 * @method static User recalculateP2p(RecalculateP2pPurchaseLimitDto $dto)
 * @method static User charge(User $client, $amount, PaymentActionEnum $log, $ctx = [])
 * @method static User extract(User $client, $amount, PaymentActionEnum $log, $ctx = [])
 *
 * @see PurchaseLimitManager
 */
class CustomerPurchaseLimit extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        self::clearResolvedInstance(PurchaseLimitManager::class);
        return PurchaseLimitManager::class;
    }
}