<?php

namespace App\Services\User\Payment\Middleware\Interfaces;

use Closure;
use App\Services\User\Payment\Middleware\Core\PaymentMiddlewareDto;

interface AfterTransaction
{
    public function afterTransactionHandler(PaymentMiddlewareDto $params, Closure $next);
}