<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Ballance;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class ReturnProductFromMaintenanceLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    public function __construct(
        private $id_maintenance = null,
        private $id_preorder = null
    ) {}

    protected $logServiceType = PaymentActionEnum::RETURN_PRODUCTS;

    protected $description = 'Return money for customer product after diagnostic';

    public function save()
    {
        $historyInfo = $this->getHistoryInfo();
        $user        = $historyInfo->getUser();
        $id_service  = $historyInfo->getServiceId();

        $paymentHistory = $this->repository()->getRecordByParams([
            'id_maintenance' => $this->id_maintenance,
            'id_preorder'    => $this->id_preorder,
            'id_user'        => $user->id,
            'id_service'     => $id_service
        ]);

        if (!$paymentHistory) {
            DB::table('payment_history')->insert([
                ...$this->_baseParams(),
                'id_maintenance' => $this->id_maintenance,
                'id_preorder'    => $this->id_preorder
            ]);
        } else {
            $this->updatePaymentHistory($paymentHistory);
        }
    }

    public function calculateSum($currentSum, $sum)
    {
        if ($this->getHistoryInfo()->getIncrease() == 'up') {
            return $currentSum + $sum;
        }
        return $currentSum - $sum;
    }
}