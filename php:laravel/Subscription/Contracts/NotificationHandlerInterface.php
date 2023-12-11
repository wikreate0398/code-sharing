<?php

namespace App\Services\Subscription\App\Contracts;

interface NotificationHandlerInterface
{
    public function handle($data): ?AdapterSubscriptionInterface;
}