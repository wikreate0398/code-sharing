<?php

namespace App\Services\Subscription\App\GooglePlay\Client;

use App\Services\Subscription\App\Adapter\GoogleSubscriptionAdapter;
use App\Services\Subscription\App\Contracts\AppSubscriptionClientInterface;
use GuzzleHttp\ClientInterface;

class GoogleSubscriptionClient implements AppSubscriptionClientInterface
{
    private $productId;

    public const PACKAGE = 'fimex.app';

    public const SUBSCRIPTION_V2_URL = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/%s/purchases/subscriptionsv2/tokens/%s";
    public const SUBSCRIPTION_URL = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/%s/purchases/subscriptions/%s/tokens/%s";
    public const SUBSCRIPTION_ACKNOWLEDGE_URL = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/%s/purchases/subscriptions/%s/tokens/%s:acknowledge";

    public function __construct(private ClientInterface $client)
    {}

    public function productId($productId)
    {
        $this->productId = $productId;
        return $this;
    }

    /**
     * @param $identifier
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * @doc https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2/get
     */
    public function getSubscription($identifier): GoogleSubscriptionAdapter
    {
        $resp = $this->client->request(
            'GET',
            sprintf(self::SUBSCRIPTION_V2_URL,self::PACKAGE, $identifier)
        );

        $result = jsonToArr($resp->getBody()->getContents());

        $subscriptionPurchase = new GoogleSubscriptionPurchase($result);

        if (!$subscriptionPurchase->isTest() && $subscriptionPurchase->getAcknowledgementState()
            == GoogleSubscriptionPurchase::ACKNOWLEDGEMENT_PENDING) {
            $this->acknowledge($identifier, $subscriptionPurchase->getDeveloperPayload());
        }

        return new GoogleSubscriptionAdapter(
            $subscriptionPurchase,
            $this->productId,
            $identifier
        );
    }

    public function acknowledge($identifier, $developerPayload)
    {
        $this->client->request(
            'POST',
            sprintf(self::SUBSCRIPTION_ACKNOWLEDGE_URL,self::PACKAGE, $this->productId, $identifier),
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],

                'body' => json_encode(compact('developerPayload'))
            ]
        );
    }

    public function getSubscriptionV1($identifier): array
    {
        $resp = $this->client->request(
            'GET',
            sprintf(self::SUBSCRIPTION_URL,self::PACKAGE, $this->productId, $identifier)
        );

        return jsonToArr($resp->getBody()->getContents());
    }
}