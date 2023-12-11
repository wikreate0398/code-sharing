<?php

namespace App\Services\Subscription\App\Adapter\Status;

use App\Services\Subscription\App\Contracts\StatusInterface;
use App\Services\Subscription\App\GooglePlay\Client\GoogleSubscriptionPurchase;

class GoogleStatus implements StatusInterface
{
    public function __construct(private $status)
    {}

    public function getName(): string
    {
        $define = 'active';
        if ($this->status == GoogleSubscriptionPurchase::SUBSCRIPTION_EXPIRED) {
            $define = 'expired';
        } else if ($this->status ==  GoogleSubscriptionPurchase::SUBSCRIPTION_PENDING) {
            $define = 'waiting_payment';
        } else if ($this->status == GoogleSubscriptionPurchase::SUBSCRIPTION_IN_GRACE_PERIOD) {
            $define = 'grace_period';
        } else if (in_array($this->status, [
            GoogleSubscriptionPurchase::SUBSCRIPTION_PAUSED,
            GoogleSubscriptionPurchase::SUBSCRIPTION_ON_HOLD
        ])) {
            $define = 'paused';
        }

        return $define;
    }
}