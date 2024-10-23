<?php

namespace App\Services\Subscription\App\Adapter;

use App\Services\Subscription\App\Adapter\Status\GoogleStatus;
use App\Services\Subscription\App\Contracts\AdapterSubscriptionInterface;
use App\Services\Subscription\App\Contracts\StatusInterface;
use App\Services\Subscription\App\GooglePlay\Client\GoogleSubscriptionPurchase;
use App\Services\Subscription\App\GooglePlay\ValuesObjects\LineItemInfo;
use Carbon\Carbon;

class GoogleSubscriptionAdapter extends AdapterSubscriptionAbstract implements AdapterSubscriptionInterface
{
    public function __construct(
        private GoogleSubscriptionPurchase $subscriptionPurchase,
        protected $productId,
        protected $identifier
    ) {
    }

    public function isTest(): bool
    {
        return $this->subscriptionPurchase->isTest();
    }

    public function getIdentifier(): string
    {
        return $this->identifier;
    }

    private function getLineItemInfo(): ?LineItemInfo
    {
        $result = array_filter($this->subscriptionPurchase->getLineItemsInfo(), function ($item) {
            return $item->getProductId() == $this->productId;
        });
        return !empty($result) ? $result[0] : null;
    }

    public function getProductId(): string
    {
        return $this->productId;
    }

    public function getAppId(): ?string
    {
        return null;
    }

    public function getPlan(): string
    {
        $plan = $this->getLineItemInfo()->getBasePlanId();
        return str_replace('-', '_', $plan);
    }

    public function getStartDate(): Carbon
    {
        return $this->subscriptionPurchase->getStartTime()->getCarbon();
    }

    public function getExpireDate(): Carbon
    {
        $currentLineItem = $this->getLineItemInfo();
        return $currentLineItem->getExpiryTime()->getCarbon();
    }

    public function getStatus(): StatusInterface
    {
        return new GoogleStatus(
            $this->subscriptionPurchase->getSubscriptionState()
        );
    }

    public function getProvider(): string
    {
        return 'google';
    }

    public function getOriginal(): GoogleSubscriptionPurchase
    {
        return $this->subscriptionPurchase;
    }
}