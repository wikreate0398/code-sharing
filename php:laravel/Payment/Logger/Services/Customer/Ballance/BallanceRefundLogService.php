<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Ballance;

use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;

class BallanceRefundLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    protected $logServiceType = 'cash_refund';

    protected $description = 'Cash refund';
}