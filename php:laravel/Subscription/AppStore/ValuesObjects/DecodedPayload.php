<?php

namespace App\Services\Subscription\App\AppStore\ValuesObjects;

use App\Services\Subscription\App\AppStore\Client\JwsDecoder;

class DecodedPayload
{
    // Types
    public const TYPE_CONSUMPTION_REQUEST = 'CONSUMPTION_REQUEST';
    public const TYPE_DID_CHANGE_RENEWAL_PREF = 'DID_CHANGE_RENEWAL_PREF';
    public const TYPE_DID_CHANGE_RENEWAL_STATUS = 'DID_CHANGE_RENEWAL_STATUS';
    public const TYPE_DID_FAIL_TO_RENEW = 'DID_FAIL_TO_RENEW';
    public const TYPE_DID_RENEW = 'DID_RENEW';
    public const TYPE_EXPIRED = 'EXPIRED';
    public const TYPE_GRACE_PERIOD_EXPIRED = 'GRACE_PERIOD_EXPIRED';
    public const TYPE_OFFER_REDEEMED = 'OFFER_REDEEMED';
    public const TYPE_PRICE_INCREASE = 'PRICE_INCREASE';
    public const TYPE_REFUND = 'REFUND';
    public const TYPE_REFUND_DECLINED = 'REFUND_DECLINED';
    public const TYPE_RENEWAL_EXTENDED = 'RENEWAL_EXTENDED';
    public const TYPE_REVOKE = 'REVOKE';
    public const TYPE_SUBSCRIBED = 'SUBSCRIBED';
    public const TYPE_TEST = 'TEST';

    // Subtypes
    public const SUBTYPE_INITIAL_BUY = 'INITIAL_BUY';
    public const SUBTYPE_RESUBSCRIBE = 'RESUBSCRIBE';
    public const SUBTYPE_DOWNGRADE = 'DOWNGRADE';
    public const SUBTYPE_UPGRADE = 'UPGRADE';
    public const SUBTYPE_AUTO_RENEW_ENABLED = 'AUTO_RENEW_ENABLED';
    public const SUBTYPE_AUTO_RENEW_DISABLED = 'AUTO_RENEW_DISABLED';
    public const SUBTYPE_VOLUNTARY = 'VOLUNTARY';
    public const SUBTYPE_BILLING_RETRY = 'BILLING_RETRY';
    public const SUBTYPE_PRICE_INCREASE = 'PRICE_INCREASE';
    public const SUBTYPE_GRACE_PERIOD = 'GRACE_PERIOD';
    public const SUBTYPE_BILLING_RECOVERY = 'BILLING_RECOVERY';
    public const SUBTYPE_PENDING = 'PENDING';
    public const SUBTYPE_ACCEPTED = 'ACCEPTED';

    /**
     * @var array
     */
    private array $data;

    /**
     * Prevent direct instantiation from outside
     */
    private function __construct(array $data)
    {
        $this->data = $data;
    }

    public static function fromJws(JwsDecoder $jws): self
    {
        return new self($jws->getPayload());
    }

    /**
     * Convert the object to its array representation.
     *
     * @return array
     */
    public function toArray(): array
    {
        return $this->data;
    }

    /**
     * Gets the notification subtype
     *
     * @return string|null
     */
    public function getSubType(): ?string
    {
        return $this->data['subtype'] ?? null;
    }

    /**
     * Gets the notification type
     *
     * @return string
     */
    public function getType(): string
    {
        return $this->data['notificationType'];
    }

    /**
     * Gets the notification UUID
     *
     * @return string
     */
    public function getNotificationUUID(): string
    {
        return $this->data['notificationUUID'];
    }

    /**
     * Gets the notification version
     *
     * @return string
     */
    public function getVersion(): string
    {
        return $this->data['version'];
    }

    /**
     * Gets the notification signed date
     *
     * @return Time
     */
    public function getSignedDate(): Time
    {
        return new Time($this->data['signedDate']);
    }

    /**
     * Gets the renewal information
     *
     * @return SignedRenewalInfo
     */
    public function getRenewalInfo(): SignedRenewalInfo
    {
        return SignedRenewalInfo::fromJws(
            new JwsDecoder($this->data['data']['signedRenewalInfo'])
        );
    }

    /**
     * Gets the transaction information
     *
     * @return SignedTransactionInfo
     */
    public function getTransactionInfo(): SignedTransactionInfo
    {
        return SignedTransactionInfo::fromJws(
            new JwsDecoder($this->data['data']['signedTransactionInfo'])
        );
    }
}