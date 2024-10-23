<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Ballance;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;

class BallanceRefundLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    protected $logServiceType = PaymentActionEnum::CASH_REFUND;

    protected $description = 'Cash refund';
}