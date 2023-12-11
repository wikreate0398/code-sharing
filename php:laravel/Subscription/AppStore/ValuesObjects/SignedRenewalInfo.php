<?php

namespace App\Services\Subscription\App\AppStore\ValuesObjects;

use App\Services\Subscription\App\AppStore\Client\JwsDecoder;

/**
 * @doc https://developer.apple.com/documentation/appstoreserverapi/jwsrenewalinfodecodedpayload
 */
class SignedRenewalInfo
{
    public const OFFER_TYPE_INTRODUCTORY = 1;
    public const OFFER_TYPE_PROMOTIONAL = 2;
    public const OFFER_TYPE_SUBSCRIPTION = 3;

    public const AUTO_RENEW_OFF = 0;
    public const AUTO_RENEW_ONN = 1;

    public const ENVIRONMENT_PRODUCTION = 'Production';
    public const ENVIRONMENT_SANDBOX = 'Sandbox';

    public const EXPIRATION_INTENT_CANCEL = 1;
    public const EXPIRATION_INTENT_BILLING_ERROR = 2;
    public const EXPIRATION_INTENT_PRICE_INCREASE_CONSENT = 3;
    public const EXPIRATION_INTENT_PRODUCT_NOT_AVAILABLE = 4;

    public function __construct(private $data)
    {}

    public static function fromJws(JwsDecoder $jws): self
    {
        return new self($jws->getPayload());
    }

    public function getOriginalTransactionId()
    {
        return $this->data['originalTransactionId'];
    }

    public function getAutoRenewStatus()
    {
        return $this->data['autoRenewStatus'];
    }

    public function getExpirationIntent()
    {
        return $this->data['expirationIntent'];
    }

    public function getEnvironment()
    {
        return $this->data['environment'];
    }

    /**
     * @return Time|null
     */
    public function getGracePeriodExpiresDate(): ?Time
    {
        if (isset($this->data['gracePeriodExpiresDate'])) {
            return new Time($this->data['gracePeriodExpiresDate']);
        }

        return null;
    }

    public function getRecentSubscriptionStartDate(): ?Time
    {
        if (isset($this->data['recentSubscriptionStartDate'])) {
            return new Time($this->data['recentSubscriptionStartDate']);
        }

        return null;
    }

    /**
     * @return bool|null
     */
    public function getIsInBillingRetryPeriod(): ?bool
    {
        return $this->data['isInBillingRetryPeriod'] ?? null;
    }

    public function getRenewalDate(): ?Time
    {
        return new Time(
            $this->data['renewalDate']
        );
    }

    public function getSignedDate(): ?Time
    {
        return new Time(
            $this->data['signedDate']
        );
    }

    public function getOfferType(): ?int
    {
        return @$this->data['offerType'];
    }

    public function getProductId()
    {
        return $this->data['productId'];
    }

    public function toArray()
    {
        return [
            ...$this->data,
            'signedDate'                  => $this->getSignedDate()->getDateTimeStr(),
            'renewalDate'                 => $this->getRenewalDate()?->getDateTimeStr(),
            'gracePeriodExpiresDate'      => $this->getGracePeriodExpiresDate()?->getDateTimeStr(),
            'recentSubscriptionStartDate' => $this->getGracePeriodExpiresDate()?->getDateTimeStr()
        ];
    }
}