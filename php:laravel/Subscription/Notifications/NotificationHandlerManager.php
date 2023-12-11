<?php

namespace App\Services\Subscription\App\Notifications;

use App\Services\Subscription\App\Contracts\AdapterSubscriptionInterface;
use App\Services\Subscription\App\Contracts\NotificationHandlerInterface;

class NotificationHandlerManager
{
    public function handle(NotificationHandlerInterface $handler, $requestData): ?AdapterSubscriptionInterface
    {
        return $handler->handle($requestData);
    }
}