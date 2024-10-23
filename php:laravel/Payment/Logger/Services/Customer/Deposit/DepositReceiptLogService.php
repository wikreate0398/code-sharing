<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Deposit;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\Customer\Ballance\BallanceReceiptLogService;

class DepositReceiptLogService extends BallanceReceiptLogService
{
    protected $logServiceType = [
        PaymentActionEnum::CASH_RECEIPT
    ];
}