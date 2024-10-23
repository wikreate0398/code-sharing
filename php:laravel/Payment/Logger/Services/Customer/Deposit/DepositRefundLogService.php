<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Deposit;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\Customer\Ballance\BallanceRefundLogService;

class DepositRefundLogService extends BallanceRefundLogService
{
    protected $logServiceType = [
        PaymentActionEnum::CASH_REFUND
    ];
}