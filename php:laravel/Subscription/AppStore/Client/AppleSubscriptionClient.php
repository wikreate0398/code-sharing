<?php

namespace App\Services\Subscription\App\AppStore\Client;

use App\Services\Subscription\App\Adapter\AppleSubscriptionAdapter;
use App\Services\Subscription\App\AppStore\ValuesObjects\SignedRenewalInfo;
use App\Services\Subscription\App\AppStore\ValuesObjects\SignedTransactionInfo;
use App\Services\Subscription\App\Contracts\AppSubscriptionClientInterface;
use GuzzleHttp\ClientInterface;

class AppleSubscriptionClient implements AppSubscriptionClientInterface
{
    public function __construct(private ClientInterface $client)
    {}

    /**
     * @param $identifier
     * @return AppleSubscriptionPurchase
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * @doc https://developer.apple.com/documentation/appstoreserverapi/get_all_subscription_statuses
     */
    public function getSubscription($identifier): AppleSubscriptionAdapter
    {
        $resp = $this->client->request('GET', "subscriptions/$identifier");
        $result = jsonToArr($resp->getBody()->getContents());

        $httpStatus = $resp->getStatusCode();
        if ($httpStatus == 404) {
            throwE('TRANSACTION_NOT_EXIST');
        } else if ($httpStatus != 200) {
            throwE($result['errorMessage']);
        }

        $lastTransactions = collect($result['data'][0]['lastTransactions'])->sortByDesc(function ($lastTransaction) {
            return JwsDecoder::toArray($lastTransaction['signedTransactionInfo'])['expiresDate'];
        });

        return new AppleSubscriptionAdapter(
            AppleSubscriptionPurchase::fromArray(
                $lastTransactions->first()
            )
        );
    }

    /**
     * @param $identifier
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * @doc https://developer.apple.com/documentation/appstoreserverapi/look_up_order_id
     */
    public function getOrder($identifier): array
    {
        $resp = $this->client->request('GET', "lookup/$identifier");
        $result = jsonToArr($resp->getBody()->getContents());

        $httpStatus = $resp->getStatusCode();
        if ($httpStatus == 404) {
            throwE('TRANSACTION_NOT_EXIST');
        } else if ($httpStatus != 200) {
            throwE($result['errorMessage']);
        }

       return JwsDecoder::toArray(
           $result['signedTransactions'][0]
       );
    }

    /**
     * @param $identifier
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * @doc https://developer.apple.com/documentation/appstoreserverapi/get_notification_history
     */
    public function getNotificationHistory($identifier, $lastDays = 100): array
    {
        $resp = $this->client->request('POST', "notifications/history", [
            'headers' => [
                'Content-Type' => 'application/json'
            ],

            'body' => json_encode([
                'transactionId' => $identifier,
                'startDate'     => now()->addDays(-$lastDays)->timestamp*1000,
                'endDate'       => now()->timestamp*1000,
            ])
        ]);

        $data = jsonToArr($resp->getBody()->getContents());

        $array = [];
        foreach ($data['notificationHistory'] as $item) {
            $signedPayload = JwsDecoder::toArray($item['signedPayload']);
            $signedPayloadData = (array) $signedPayload['data'];

            $transactionInfo = SignedTransactionInfo::fromJws(
                new JwsDecoder($signedPayloadData['signedTransactionInfo'])
            );

            $renewalInfo =  SignedRenewalInfo::fromJws(
                new JwsDecoder($signedPayloadData['signedRenewalInfo'])
            );

            $array[] = [
                ...$item,
                'signedPayload' => [
                    ...$signedPayload,
                    'data' => [
                        ...$signedPayloadData,
                        'signedTransactionInfo' => $transactionInfo->toArray(),
                        'signedRenewalInfo'     => $renewalInfo->toArray()
                    ]
                ]
            ];
        }

        return $array;
    }
}