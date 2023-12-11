<?php

namespace App\Services\Subscription\App\Adapter;

use App\Services\Subscription\App\Adapter\Status\AppleStatus;
use App\Services\Subscription\App\AppStore\Client\AppleSubscriptionPurchase;
use App\Services\Subscription\App\Contracts\AdapterSubscriptionInterface;
use App\Services\Subscription\App\Contracts\StatusInterface;
use Carbon\Carbon;

class AppleSubscriptionAdapter extends AdapterSubscriptionAbstract implements AdapterSubscriptionInterface
{
    public function __construct(private AppleSubscriptionPurchase $subscriptionPurchase)
    {}

    public function isTest(): bool
    {
        return $this->subscriptionPurchase->isTest();
    }

    public function getIdentifier(): string
    {
        return $this->subscriptionPurchase->getTransactionInfo()->getOriginalTransactionId();
    }

    public function getProductId(): ?string
    {
        return null;
    }

    public function getPlan(): string
    {
        return $this->subscriptionPurchase->getTransactionInfo()->getProductId();
    }

    public function getStartDate(): Carbon
    {
        return $this->subscriptionPurchase->getTransactionInfo()->getPurchaseDate()->getCarbon();
    }

    public function getExpireDate(): Carbon
    {
        return $this->subscriptionPurchase->getTransactionInfo()->getExpiresDate()->getCarbon();
    }

    public function getStatus(): StatusInterface
    {
        return new AppleStatus(
            $this->subscriptionPurchase->getStatus(),
            $this->subscriptionPurchase->getTransactionInfo()->getOfferType()
        );
    }

    public function getProvider(): string
    {
        return 'apple';
    }

    public function getOriginal(): AppleSubscriptionPurchase
    {
        return $this->subscriptionPurchase;
    }
}