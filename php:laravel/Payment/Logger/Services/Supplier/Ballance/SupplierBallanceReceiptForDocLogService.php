<?php

namespace App\Services\User\Payment\Logger\Services\Supplier\Ballance;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class SupplierBallanceReceiptForDocLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    public function __construct(
        private $id_provider_number = null
    ) {}

    protected $logServiceType = PaymentActionEnum::PAYMENT_FOR_DOCUMENTS;

    protected $description = 'Payment for documents - info';

    public function save()
    {
        DB::table('payment_history')->insert([
            ...$this->_baseParams(),
            'id_provider_number' => $this->id_provider_number
        ]);
    }
} 