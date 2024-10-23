<?php

namespace App\Services\User\Payment\Middleware;

use App\Services\User\Payment\Middleware\Interfaces\AfterTransaction;
use App\Services\User\Payment\Middleware\Interfaces\BeforeTransaction;

class KernelPaymentMiddleware
{

    /**
     * Классы реализуются до совершения оплаты
     *
     * @return BeforeTransaction[]
     */
    public function beforeTransactionMiddleware(): array
    {
        return [
            VerifyResellerDepositExtractionPaymentMiddleware::class
        ];
    }

    /**
     * Классы реализуются после совершения оплаты
     *
     * @return AfterTransaction[]
     */
    public function afterTransactionMiddleware(): array
    {
        return [
            MultiplicateDepositPaymentMiddleware::class
            //CustomAfterPaymentMiddleware::class
        ];
    }
}