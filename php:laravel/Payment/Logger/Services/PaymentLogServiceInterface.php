<?php

namespace App\Services\User\Payment\Logger\Services;

interface PaymentLogServiceInterface
{
    public function save();

    public function calculateSum(float $currentSum, float $sum);
}