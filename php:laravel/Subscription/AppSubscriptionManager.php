<?php

namespace App\Services\Subscription\App;

use App\Services\Subscription\App\AppStore\Client\AppleSubscriptionClient;
use App\Services\Subscription\App\AppStore\Client\Http\HttpClientFactory as AppStoreHttpClient;
use App\Services\Subscription\App\Contracts\AdapterSubscriptionInterface;
use App\Services\Subscription\App\Contracts\AppSubscriptionClientInterface;
use App\Services\Subscription\App\GooglePlay\Client\GoogleSubscriptionClient;
use App\Services\Subscription\App\GooglePlay\Client\Http\HttpClientFactory as GooglePlayHttpClient;
use App\Services\Subscription\App\Notifications\AppleNotificationHandler;
use App\Services\Subscription\App\Notifications\GoogleNotificationHandler;
use App\Services\Subscription\App\Notifications\NotificationHandlerManager;

class AppSubscriptionManager
{
    /**
     * @var AppSubscriptionClientInterface
     */
    private $client;

    /**
     * @var string
     */
    private $identifier;

    /**
     * @var string|null
     */
    private $productId;

    /**
     * @var boolean
     */
    private $isGooglePlay;

    /**
     * @var AdapterSubscriptionInterface
     */
    private $subscription;

    public function __construct(
        private NotificationHandlerManager $notificationHandler
    ) {}

    /**
     * @param $value
     * @return $this
     * @throws \Exception
     */
    public function provider($value, $bundle_id = null)
    {
        if (!in_array($value, ['apple', 'google'])) {
            throwE('Invalid provider');
        }

        return $value == 'apple' ? $this->appStore($bundle_id) : $this->googlePlay();
    }

    /**
     * @return $this
     */
    public function googlePlay()
    {
        $this->isGooglePlay = true;
        $this->client = new GoogleSubscriptionClient(
            GooglePlayHttpClient::create()
        );
        return $this;
    }

    /**
     * @return $this
     */
    public function appStore($boundle_id = null)
    {
        $this->isGooglePlay = false;

        $this->client = new AppleSubscriptionClient(
            AppStoreHttpClient::create(isDev(), boundle_id: $boundle_id)
        );
        return $this;
    }

    /**
     * @param $identifier
     * @return $this
     */
    public function identifier($identifier)
    {
        $this->identifier = $identifier;
        return $this;
    }

    /**
     * @param $productId
     * @return $this
     */
    public function productId($productId)
    {
        $this->productId = $productId;
        return $this;
    }

    /**
     * @return $this
     */
    private function fetchSubscription()
    {
        if ($this->isGooglePlay) {
            $this->client->productId($this->productId);
        }

        $this->subscription = $this->client->getSubscription($this->identifier);
        return $this;
    }

    /**
     * @return AdapterSubscriptionInterface
     */
    public function getSubscription(): AdapterSubscriptionInterface
    {
        if (!$this->subscription) {
            $this->fetchSubscription();
        }
        return $this->subscription;
    }

    public function getAppleOrderId($identifier = null): array
    {
        return $this->client->getOrder($identifier ?: $this->identifier);
    }

    /**
     * @return AppSubscriptionClientInterface
     */
    public function getClient(): ?AppSubscriptionClientInterface
    {
        return $this->client;
    }

    /**
     * @param $requestData
     * @return AdapterSubscriptionInterface|null
     * @throws \Exception
     */
    public function handleNotification($requestData): ?AdapterSubscriptionInterface
    {
        try {
            return $this->notificationHandler->handle(
                app($this->isGooglePlay ? GoogleNotificationHandler::class : AppleNotificationHandler::class),
                $requestData
            );
        } catch (\Exception $e) {
            logTelegram(exceptionToStr($e), critical: true);
            throw  $e;
        }
    }
}