<?php

namespace App\Services\Subscription\App\AppStore\ValuesObjects;

use App\Services\Subscription\App\AppStore\Client\JwsDecoder;

/**
 * @doc https://developer.apple.com/documentation/appstoreserverapi/jwstransactiondecodedpayload
 */
class SignedTransactionInfo
{
    public const OFFER_TYPE_INTRODUCTORY = 1;
    public const OFFER_TYPE_PROMOTIONAL = 2;
    public const OFFER_TYPE_SUBSCRIPTION = 3;

    public function __construct(private $data)
    {}

    public static function fromJws(JwsDecoder $jws): self
    {
        return new self($jws->getPayload());
    }

    public function getTransactionId()
    {
        return $this->data['transactionId'];
    }

    public function getOriginalTransactionId()
    {
        return $this->data['originalTransactionId'];
    }

    public function getEnvironment()
    {
        return $this->data['environment'];
    }

    public function getBoundleId()
    {
        return $this->data['bundleId'];
    }

    public function getExpiresDate(): ?Time
    {
        return new Time(
            $this->data['expiresDate']
        );
    }

    public function getSignedDate(): ?Time
    {
        return new Time(
            $this->data['signedDate']
        );
    }

    public function getPurchaseDate(): ?Time
    {
        return new Time(
            $this->data['purchaseDate']
        );
    }

    public function getOriginalPurchaseDate(): ?Time
    {
        return new Time(
            $this->data['originalPurchaseDate']
        );
    }

    public function getRevocationDate(): ?Time
    {
        if (!isset($this->data['revocationDate'])) {
            return null;
        }

        return new Time(
            $this->data['revocationDate']
        );
    }

    public function getTransactionReason()
    {
        return $this->data['transactionReason'];
    }

    public function getType()
    {
        return $this->data['type'];
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
            'originalPurchaseDate' => $this->getOriginalPurchaseDate()->getDateTimeStr(),
            'purchaseDate'         => $this->getPurchaseDate()->getDateTimeStr(),
            'expiresDate'          => $this->getExpiresDate()->getDateTimeStr(),
            'signedDate'           => $this->getSignedDate()->getDateTimeStr(),
            'revocationDate'       => $this->getRevocationDate()?->getDateTimeStr()
        ];
    }
}