<?php

namespace App\Services\User\Payment\Middleware\Core;

use App\Models\User;
use App\Services\User\Payment\Enums\CashboxEnum;
use Closure;

abstract class PaymentMiddleware
{
    protected $cashboxAccess = null;

    abstract public function auth(User $user): bool;

    public function getCashboxAccess(): ?CashboxEnum
    {
        return $this->cashboxAccess;
    }
}