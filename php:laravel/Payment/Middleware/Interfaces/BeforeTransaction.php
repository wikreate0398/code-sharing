<?php

namespace App\Services\User\Payment\Middleware\Interfaces;

use Closure;
use App\Services\User\Payment\Middleware\Core\PaymentMiddlewareDto;

interface BeforeTransaction
{
    public function beforeTransactionHandler(PaymentMiddlewareDto $params, Closure $next);
}