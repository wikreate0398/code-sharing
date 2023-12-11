<?php

namespace App\Services\Subscription\App\GooglePlay\Client\Http;

use Google\Auth\ApplicationDefaultCredentials;
use Google\Auth\Middleware\AuthTokenMiddleware;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\HandlerStack;

class HttpClientFactory
{
    public const SCOPE_ANDROID_PUBLISHER = 'https://www.googleapis.com/auth/androidpublisher';
    private const BASE_URI = 'https://www.googleapis.com';
    private const GOOGLE_AUTH = 'google_auth';

    public static function create(array $scopes = [self::SCOPE_ANDROID_PUBLISHER]): ClientInterface
    {
        $middleware = ApplicationDefaultCredentials::getMiddleware($scopes);
        return self::createWithMiddleware($middleware);
    }
    
    public static function createWithMiddleware(AuthTokenMiddleware $middleware): ClientInterface
    {
        $stack = HandlerStack::create();
        $stack->push($middleware);

        return new Client([
            'handler' => $stack,
            'base_uri' => self::BASE_URI,
            'auth' => self::GOOGLE_AUTH,
        ]);
    }
}