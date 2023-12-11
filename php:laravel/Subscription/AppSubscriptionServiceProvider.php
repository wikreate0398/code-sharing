<?php

namespace App\Services\Subscription\App;

use App\Services\Subscription\App\AppStore\Client\AppleSubscriptionClient;
use App\Services\Subscription\App\AppStore\Client\Http\HttpClientFactory as AppStoreHttpClient;
use App\Services\Subscription\App\GooglePlay\Client\GoogleSubscriptionClient;
use App\Services\Subscription\App\GooglePlay\Client\Http\HttpClientFactory as GooglePlayHttpClient;
use Illuminate\Support\ServiceProvider;

class AppSubscriptionServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(AppleSubscriptionClient::class, function () {
            return new AppleSubscriptionClient(
                AppStoreHttpClient::create()
            );
        });

        $this->app->bind(GoogleSubscriptionClient::class, function () {
            return new GoogleSubscriptionClient(
                GooglePlayHttpClient::create()
            );
        });
    }
}