<?php

namespace App\Services\Subscription\App\GooglePlay\ValuesObjects;

class LineItemInfo
{
    public function __construct(private array $data = [])
    {}

    public static function fromArray(array $data): self
    {
        return new self($data);
    }

    /**
     * @return string
     */
    public function getProductId()
    {
        return $this->data['productId'];
    }

    /**
     * @return Time
     */
    public function getExpiryTime(): Time
    {
        return new Time($this->data['expiryTime']);
    }

    /**
     * @return string
     */
    public function getBasePlanId(): ?string
    {
        return @$this->data['offerDetails']['basePlanId'];
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return $this->data;
    }
}