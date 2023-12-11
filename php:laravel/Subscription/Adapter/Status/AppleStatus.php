<?php

namespace App\Services\Subscription\App\Adapter\Status;

use App\Services\Subscription\App\Contracts\StatusInterface;

class AppleStatus implements StatusInterface
{
    public function __construct(private $status, private $offerType)
    {}

    public function getName(): string
    {
        $define = 'active';
        if ($this->status == 1 && $this->offerType == 1) {
            $define = 'trial';
        } else if ($this->status == 2) {
            $define = 'expired';
        } else if ($this->status == 3) {
            $define = 'waiting_payment';
        } else if ($this->status == 4) {
            $define = 'grace_period';
        } else if ($this->status == 5) {
            $define = 'revoked';
        }

        return $define;
    }
}