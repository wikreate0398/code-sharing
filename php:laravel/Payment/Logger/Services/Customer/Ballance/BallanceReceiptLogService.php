<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Ballance;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;

class BallanceReceiptLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    protected $logServiceType = PaymentActionEnum::CASH_RECEIPT;

    protected $description = 'Cash receipt order';

    public function calculateSum($currentSum, $sum)
    {
        if ($this->getHistoryInfo()->getIncrease() == 'up') {
            return $currentSum + $sum;
        }
        return $currentSum - $sum;
    }
}