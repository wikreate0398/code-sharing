<?php

namespace App\Services\Subscription\App\Contracts;

interface AppSubscriptionClientInterface
{
    public function getSubscription($identifier): AdapterSubscriptionInterface;
}