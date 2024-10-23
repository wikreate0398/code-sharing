<?php

namespace App\Services\Subscription\App;

use Illuminate\Support\Facades\Facade;

/**
 * @method static AppSubscriptionManager googlePlay()
 * @method static AppSubscriptionManager appStore($bundle_id = null)
 * @method static AppSubscriptionManager provider(string $value, $bundle_id = null)
 *
 * @see AppSubscriptionManager
 */
class AppSubscription extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        self::clearResolvedInstance(AppSubscriptionManager::class);

        return AppSubscriptionManager::class;
    }
}