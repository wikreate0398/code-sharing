<?php

namespace App\Services\User\Payment\Logger\Services\Traits;

use App\Models\Payment\PaymentHistory;
use Illuminate\Support\Facades\DB;

trait BallanceLogServiceTrait
{
    protected function _baseParams(): array
    {
        $historyInfo = $this->getHistoryInfo();
        $user        = $historyInfo->getUser();
        $date        = $historyInfo->getDate() ?: now();

        return [
            'id_user'    => $user->id,
            'increase'   => $historyInfo->getIncrease(),
            'cashbox'    => $this->getCashbox(),
            'sum'        => $historyInfo->getAmount(),
            'ballance'   => $user[$this->_field()],
            'date'       => $date,
            'created_at' => $date,
            'updated_at' => $date,
        ];
    }


    private function _field()
    {
        return match ($this->getCashbox()) {
            'ballance' => 'ballance',
            'deposit'  => 'deposit'
        };
    }

    public function save()
    {
        $historyInfo = $this->getHistoryInfo();
        $id_service  = $historyInfo->getServiceId();
        $history     = $this->repository()->getHistoryRecordByCond($historyInfo, $id_service);

        if ($history && $historyInfo->getId()) {
            $this->updatePaymentHistory($history);
            return;
        }

        $this->createPaymentHistory();
    }

    private function createPaymentHistory()
    {
        DB::table('payment_history')->insert([
            ...$this->_baseParams(),
            'id_service' => $this->getHistoryInfo()->getServiceId()
        ]);
    }

    protected function updatePaymentHistory(PaymentHistory $existedRecord)
    {
        $diff = $this->getHistoryInfo()->getAmount();
        $sum  = $this->calculateSum($existedRecord->sum, $diff);

        if ($sum == 0) {
            $this->repository()->delete($existedRecord->id);
        } else {
            $this->repository()->update([
                'date'       => $this->getHistoryInfo()->getDate() ?: $existedRecord->date,
                'sum'        => $sum,
                'ballance'   => $this->getHistoryInfo()->getUser()[$this->_field()]
            ], $existedRecord->id);
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