<?php

namespace App\Services\User\Payment\PurchaseLimit;

use App\Dto\P2p\RecalculateP2pPurchaseLimitDto;
use App\Exceptions\P2pBidException;
use App\Models\User;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInfo;
use App\Services\User\Payment\Payment;

/**
 * @see CustomerPurchaseLimit
 */
class PurchaseLimitManager
{

    public function __construct(){}

    private $ctx = [];

    public function withCtx(array $ctx = []): static
    {
        $this->ctx = $ctx;
        return $this;
    }

    public function extractOnPurchase(User $user, $amount, $discount = false): User
    {
        $log = $discount ? PaymentActionEnum::discounted_purchase : PaymentActionEnum::preorder_purchase;
        return $this->extract($user, $amount, $log);
    }

    public function recalculateP2p(RecalculateP2pPurchaseLimitDto $dto): User
    {
        [
            'prevPrice' => $prevPrice,
            'prevQty'   => $prevQty,
            'newPrice'  => $newPrice,
            'newQty'    => $newQty,
            'customer'  => $customer
        ] = $dto->toArray();

        // prev price & qty is required, new price or new qty should be passed
        if (!$newPrice && !$newQty || (!$prevPrice || !$prevQty)) {
            return $customer;
        }

        $prevAmount = $prevPrice * $prevQty;

        if ($newQty && $newPrice) {
            $newAmount = $newPrice * $newQty;
            $log = PaymentActionEnum::update_p2p;
        } elseif ($newQty) { // only new qty
            $newAmount = $prevPrice * $newQty;
            $log = PaymentActionEnum::update_qty_p2p;
        } else { // only new price
            $newAmount = $newPrice * $prevQty;
            $log = PaymentActionEnum::update_price_p2p;
        }

        $ctx = array_filter(compact('prevPrice', 'prevQty', 'newPrice', 'newQty'));

        if ($newAmount > $prevAmount) {
            $diff = $newAmount - $prevAmount;

            if ($customer->freePurchaseBallance() - $diff < 0) {
                throw new P2pBidException('Not enough balance to buy', 704);
            }

            return $this->extract($customer, $diff, $log, $ctx);
        } else if ($prevAmount > $newAmount) {
            $diff = $prevAmount - $newAmount;
            return $this->charge($customer, $diff, $log, $ctx);
        }

        // ignore if passed new price & qty is equal with prev values
        return $customer;
    }

    public function charge(User $client, $amount, PaymentActionEnum $log, $ctx = []): User
    {
        if ($client->canUpdatePurchaseLimit()) {
            return Payment::purchaseLimitCashbox($client)
                ->charge($amount)
                ->log($log, callback: function (LogHistoryInfo $m) use ($ctx) {
                    $m->setCtx([...$ctx, ...$this->ctx]);
                })->getUpdatedUser();
        }

        return $client;
    }

    public function extract(User $client, $amount, PaymentActionEnum $log, $ctx = []): User
    {
        if ($client->canUpdatePurchaseLimit()) {
            return Payment::purchaseLimitCashbox($client)
                ->extract($amount)
                ->log($log, callback: function (LogHistoryInfo $m) use ($ctx) {
                    $m->setCtx([...$ctx, ...$this->ctx]);
                })->getUpdatedUser();
        }

        return $client;
    }
}