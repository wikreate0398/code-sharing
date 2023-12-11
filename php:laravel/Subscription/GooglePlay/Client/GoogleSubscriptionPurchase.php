<?php

namespace App\Services\Subscription\App\GooglePlay\Client;

use App\Services\Subscription\App\GooglePlay\ValuesObjects\LineItemInfo;
use App\Services\Subscription\App\GooglePlay\ValuesObjects\Time;

class GoogleSubscriptionPurchase
{
    public const SUBSCRIPTION_UNSPECIFIED = 'SUBSCRIPTION_STATE_UNSPECIFIED';
    public const SUBSCRIPTION_PENDING = 'SUBSCRIPTION_STATE_PENDING';
    public const SUBSCRIPTION_ACTIVE = 'SUBSCRIPTION_STATE_ACTIVE';
    public const SUBSCRIPTION_PAUSED = 'SUBSCRIPTION_STATE_PAUSED';
    public const SUBSCRIPTION_IN_GRACE_PERIOD = 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD';
    public const SUBSCRIPTION_ON_HOLD = 'SUBSCRIPTION_STATE_ON_HOLD';
    public const SUBSCRIPTION_CANCELED = 'SUBSCRIPTION_STATE_CANCELED';
    public const SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_STATE_EXPIRED';

    public const ACKNOWLEDGEMENT_UNSPECIFIED = 'ACKNOWLEDGEMENT_STATE_UNSPECIFIED';
    public const ACKNOWLEDGEMENT_PENDING = 'ACKNOWLEDGEMENT_STATE_PENDING';
    public const ACKNOWLEDGEMENT_ACKNOWLEDGED = 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED';

    /**
     * @var string|null
     */
    protected $kind;

    /**
     * @var string
     */
    protected $startTime;

    /**
     * @var string
     */
    protected $subscriptionState;

    /**
     * @var string
     */
    protected $acknowledgementState;

    /**
     * @var string
     */
    protected $developerPayload;

    /**
     * @var string
     */
    protected $latestOrderId;

    /**
     * @var string
     */
    protected $linkedPurchaseToken;

    /**
     * @var array
     */
    protected $lineItems;

    /**
     * @var array|LineItemInfo[]
     */
    protected $lineItemInfo;

    /**
     * @var array
     */
    protected $plainResponse;

    /**
     * Subscription Purchase Constructor.
     */
    public function __construct(array $responseBody = [])
    {
        $attributes = array_keys(get_class_vars(self::class));

        foreach ($attributes as $attribute) {
            if (isset($responseBody[$attribute])) {
                $this->$attribute = $responseBody[$attribute];
            }
        }

        $this->plainResponse = $responseBody;
    }

    public static function fromArray(array $responseBody): self
    {
        return new self($responseBody);
    }

    /**
     * @ return string|null
     */
    public function getKind(): ?string
    {
        return $this->kind;
    }

    /**
     * @ return string|null
     */
    public function getLinkedPurchaseToken(): ?string
    {
        return $this->linkedPurchaseToken;
    }

    public function getSubscriptionState()
    {
        return $this->subscriptionState;
    }

    public function getAcknowledgementState(): ?string
    {
        return $this->acknowledgementState;
    }

    public function isTest()
    {
        return isset($this->plainResponse['testPurchase']);
    }

    public function getDeveloperPayload(): ?string
    {
        return $this->developerPayload;
    }

    public function getStartTime(): ?Time
    {
        return is_null($this->startTime) ? null : new Time($this->startTime);
    }

    /**
     * @return array
     */
    public function getLineItems()
    {
        return $this->lineItems;
    }

    /**
     * @return array|LineItemInfo[]
     */
    public function getLineItemsInfo(): array
    {
        if ($this->lineItemInfo) {
            return $this->lineItemInfo;
        }

        $data = [];
        foreach (array_reverse($this->lineItems ?: []) as $item) {
            $data[] = LineItemInfo::fromArray($item);
        }
        return $data;
    }

    public function getPlainResponse(): array
    {
        return $this->plainResponse;
    }

    public function toArray(): array
    {
        return $this->getPlainResponse();
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}