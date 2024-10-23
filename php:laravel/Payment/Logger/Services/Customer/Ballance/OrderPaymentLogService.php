<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Ballance;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class OrderPaymentLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    public function __construct(
        private $id_number = null
    ) {}

    protected $logServiceType = PaymentActionEnum::ORDER_PAYMENT;

    protected $description = 'Order payment';

    public function save()
    {
        $historyInfo = $this->getHistoryInfo();
        $user        = $historyInfo->getUser();
        $id_service  = $historyInfo->getServiceId();

        $existedRecord = $this->repository()->getRecordByParams([
            'id_number' => $this->id_number, 'id_user' => $user->id, 'id_service' => $id_service
        ]);

        $ctx = $historyInfo->getCtx();

        if (!$existedRecord) { // additional cond to avoid dedublication
            DB::table('payment_history')->insert([
                ...$this->_baseParams(),
                'id_number' => $this->id_number,
                'ctx' => $this->prepareCtx(new: [
                    'date' => now()->format('Y.m.d H:i:s'),
                    ...$ctx
                ])
            ]);
        } else {
            $diff = $this->getHistoryInfo()->getAmount();
            $sum  = $this->calculateSum($existedRecord->sum, $diff);

            if ($sum == 0) {
                $this->repository()->delete($existedRecord->id);
            } else {
                $data = [
                    'date'     => $this->getHistoryInfo()->getDate() ?: $existedRecord->date,
                    'sum'      => $sum,
                    'ballance' => $this->getHistoryInfo()->getUser()[$this->_field()],
                    'ctx'      => $this->prepareCtx($existedRecord->ctx, [
                        'date' => now()->format('Y.m.d H:i:s'),
                        ...$ctx
                    ])
                ];

                $this->repository()->update($data, $existedRecord->id);
            }
        }
    }

    public function calculateSum($currentSum, $sum)
    {
        if ($this->getHistoryInfo()->getIncrease() == 'up') {
            return $currentSum - $sum;
        }
        return $currentSum + $sum;
    }
}