<?php

namespace App\Services\Subscription\App\Contracts;

use App\Services\Subscription\App\AppStore\Client\AppleSubscriptionPurchase;
use App\Services\Subscription\App\GooglePlay\Client\GoogleSubscriptionPurchase;
use Carbon\Carbon;

interface AdapterSubscriptionInterface
{
    public function isTest(): bool;

    public function getIdentifier(): string;

    /*
     * Only for google productId
     */
    public function getProductId(): ?string;

    public function getAppId(): ?string;

    public function getPlan(): string;

    public function getStartDate(): Carbon;

    public function getExpireDate(): Carbon;

    public function getStatus(): StatusInterface;

    public function getProvider(): string;

    public function getOriginal(): AppleSubscriptionPurchase|GoogleSubscriptionPurchase;

    public function toArray(): array;
}