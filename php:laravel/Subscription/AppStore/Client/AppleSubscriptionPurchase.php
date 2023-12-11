<?php

namespace App\Services\Subscription\App\AppStore\Client;

use App\Services\Subscription\App\AppStore\ValuesObjects\SignedRenewalInfo;
use App\Services\Subscription\App\AppStore\ValuesObjects\SignedTransactionInfo;

class AppleSubscriptionPurchase
{
    public static function fromArray(array $data)
    {
        return new self($data);
    }

    public function __construct(private array $data)
    {}

    public function getStatus()
    {
        return $this->data['status'];
    }

    public function isTest()
    {
        return $this->data['environment'] == 'Sandbox';
    }

    public function getRenewalInfo(): SignedRenewalInfo
    {
        return SignedRenewalInfo::fromJws(
            new JwsDecoder($this->data['signedRenewalInfo'])
        );
    }

    public function getTransactionInfo(): SignedTransactionInfo
    {
        return SignedTransactionInfo::fromJws(
            new JwsDecoder($this->data['signedTransactionInfo'])
        );
    }

    public function toArray()
    {
        return [
            'status'                => $this->getStatus(),
            'renewalInfo'           => $this->getRenewalInfo()->toArray(),
            'transactionInfo'       => $this->getTransactionInfo()->toArray()
        ];
    }
}