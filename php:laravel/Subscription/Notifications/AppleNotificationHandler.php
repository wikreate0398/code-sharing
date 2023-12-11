<?php

namespace App\Services\Subscription\App\Notifications;

use App\Services\Subscription\App\Adapter\AppleSubscriptionAdapter;
use App\Services\Subscription\App\AppStore\Client\AppleSubscriptionPurchase;
use App\Services\Subscription\App\AppStore\Client\JwsDecoder;
use App\Services\Subscription\App\Contracts\NotificationHandlerInterface;
use Illuminate\Support\Facades\Log;

class AppleNotificationHandler implements NotificationHandlerInterface
{
    public function __construct()
    {}

    /**
     * @param $data
     * @return AppleSubscriptionAdapter|null
     *
     * @doc https://developer.apple.com/documentation/appstoreservernotifications/responsebodyv2decodedpayload
     */
    public function handle($data): ?AppleSubscriptionAdapter
    {
        $decoder = new JwsDecoder($data);

        $payload = $decoder->getPayload();
        $dataPayload = !empty($payload['data']) ? (array) $payload['data'] : [];

        if (empty($dataPayload)) {
            return null;
        }

        Log::channel('subscription-notification')->withContext([
            ...$dataPayload,
            'signedTransactionInfo' => JwsDecoder::toArray($dataPayload['signedTransactionInfo']),
            'signedRenewalInfo' => JwsDecoder::toArray($dataPayload['signedTransactionInfo'])
        ])->info('Apple Webhook');

        return new AppleSubscriptionAdapter(
            new AppleSubscriptionPurchase($dataPayload)
        );
    }
}