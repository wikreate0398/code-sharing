<?php

namespace App\Services\User\Payment\Logger\Services\Supplier\Ballance;

use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class SupplierBallancePenaltyLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    public function __construct(
        protected $id_preorder = null
    ) {}

    protected $logServiceType = 'supplier_penalty';

    protected $description = 'Penalty supplier - info';

    public function save()
    {
        $user = $this->getHistoryInfo()->getUser();
        $paymentHistory = $this->repository()->getPenaltyPaymentHistory(
            $this->id_preorder, $user->id
        );

        if (!$paymentHistory) {
            DB::table('payment_history')->insert([
                ...$this->_baseParams(),
                'id_service'  => $this->getHistoryInfo()->getServiceId(),
                'id_preorder' => $this->id_preorder
            ]);
            return;
        }

        $this->updatePaymentHistory($paymentHistory);
    }
}