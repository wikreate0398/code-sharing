<?php

namespace App\Services\Subscription\App\Notifications;

use App\Services\Subscription\App\Adapter\GoogleSubscriptionAdapter;
use App\Services\Subscription\App\Contracts\NotificationHandlerInterface;
use App\Services\Subscription\App\GooglePlay\Client\GoogleSubscriptionClient;
use Illuminate\Support\Facades\Log;

class GoogleNotificationHandler implements NotificationHandlerInterface
{
    public function __construct(private GoogleSubscriptionClient $client)
    {}

    /**
     * @param $data
     * @return GoogleSubscriptionAdapter|null
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * @doc https://developer.android.com/google/play/billing/rtdn-reference
     */
    public function handle($data): ?GoogleSubscriptionAdapter
    {
//        echo base64_encode(json_encode([
//            'subscriptionNotification' => [
//                'purchaseToken' => 'jlilgafchjlkdlcjjmhcible.AO-J1OxOwakwufA5XIhz0fGDe6LVfM9doFOPUpbMGb_AeNo5to7zgebrUhwYoJEvuE73kqMudL00Os-AGAwfe8gRp9-kH3A4HA',
//                'subscriptionId' => 'fimex_sub'
//            ]
//        ]));

        $decoded = json_decode(base64_decode($data), true);

        Log::channel('subscription-notification')->withContext($decoded)->info('Google Webhook');

        if (empty($decoded['subscriptionNotification'])) {
            return null;
        }

        $subscriptionNotification = $decoded['subscriptionNotification'];
        return $this->client->productId($subscriptionNotification['subscriptionId'])
            ->getSubscription($subscriptionNotification['purchaseToken']);
    }
}