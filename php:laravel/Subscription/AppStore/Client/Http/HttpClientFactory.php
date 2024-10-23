<?php

namespace App\Services\Subscription\App\AppStore\Client\Http;

use App\Services\Subscription\App\AppStore\Client\AuthToken;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;

class HttpClientFactory
{
    public const STORE_KIT_PRODUCTION_URI = 'https://api.storekit.itunes.apple.com/inApps/v1/';
    public const STORE_KIT_SANDBOX_URI = 'https://api.storekit-sandbox.itunes.apple.com/inApps/v1/';

    public static function create(bool $sandbox = false, array $options = [], $boundle_id = null): ClientInterface
    {
        $token = new AuthToken(config('subscriptions.apple'), $boundle_id);
        return new Client([
            'base_uri' => $sandbox ? self::STORE_KIT_SANDBOX_URI : self::STORE_KIT_PRODUCTION_URI,
            'headers' => [
                'Authorization' => "Bearer " . $token->get()
            ],
            ...$options,
        ]);
    }
}