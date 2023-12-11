<?php

namespace App\Services\User\Payment\Logger\Services\Supplier\Ballance;

use App\Repository\Interfaces\ReasonReturnRepositoryInterface;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class SupplierBallanceReasonReturnLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    public function __construct(
        private $id_reason = null
    ) {}

    protected $logServiceType = 'return_products';

    protected $description = 'Return products - info';

    public function save()
    {
        $historyInfo = $this->getHistoryInfo();
        $id_service  = $historyInfo->getServiceId();
        $id_reason   = $this->id_reason;

        $existedRecord = $this->repository()->getRecordByParams(
            compact('id_reason', 'id_service')
        );

        if (!$existedRecord) {
            DB::table('payment_history')->insert([
                ...$this->_baseParams(),
                ...compact('id_service', 'id_reason')
            ]);
        } else {
            $diff = $historyInfo->getAmount();
            $sum  = $this->calculateSum($existedRecord->sum, $diff);

            if ($sum == 0) {
                $this->repository()->delete($existedRecord->id);
                app(ReasonReturnRepositoryInterface::class)->delete($existedRecord->id_reason);
            } else {
                $this->repository()->update([
                    'date'       => $historyInfo->getDate() ?: $existedRecord->date,
                    'sum'        => $sum,
                    'ballance'   => $historyInfo->getUser()->ballance
                ], $existedRecord->id);
            }
        }
    }
}