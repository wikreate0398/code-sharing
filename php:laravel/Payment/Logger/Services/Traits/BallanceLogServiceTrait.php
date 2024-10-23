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

        $ctx = $historyInfo->getCtx();

        return [
            'id_admin'    => $historyInfo->getAdmin()?->id,
            'id_service'  => $historyInfo->getServiceId(),
            'id_user'     => $user->id,
            'increase'    => $historyInfo->getIncrease(),
            'cashbox'     => $this->getCashbox(),
            'sum'         => $historyInfo->getAmount(),
            'ballance'    => $user[$this->_field()],
            'date'        => $date,
            'created_at'  => $date,
            'updated_at'  => $date,
            'ctx'         => $this->prepareCtx(new: ['date' => now()->format('Y-m-d H:i:s'), ...$ctx])
        ];
    }

    /**
     * @param array|null $current
     * @param array|null $new
     * @return string|null
     *
     * Одна запись может несколько раз пересчитываться. Например баланс заказа.
     * Контекст хранит логи каждого изменения
     */
    protected function prepareCtx(array|null $current = null, array|null $new = null): string|null
    {
        if (!$current && !$new) return null;

        $data = [];

        if (!empty($current)) {
            $data = !empty($current[0]) ? $current : [$current];
        }

        if ($new) {
            $data[] = [
                ...$new,
                'amount'   => $this->getHistoryInfo()->getAmount(),
                'increase' => $this->getHistoryInfo()->getIncrease(),
                'ballance' => $this->getUserBallanceFieldVal()
            ];
        }

        return json_encode($data);
    }

    private function _field()
    {
        return match ($this->getCashbox()) {
            'ballance'       => 'ballance',
            'deposit'        => 'deposit',
            'penalty'        => 'penalty_ballance',
            'purchase_limit' => 'purchase_ballance'
        };
    }

    public function save()
    {
        $historyInfo = $this->getHistoryInfo();
        $id_service  = $historyInfo->getServiceId();
        $history     = $this->repository()->getHistoryRecordByCond($historyInfo, $id_service, $this->getCashbox());

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
                'ballance'   => $this->getUserBallanceFieldVal()
            ], $existedRecord->id);
        }
    }

    protected function getUserBallanceFieldVal()
    {
        return $this->getHistoryInfo()->getUser()[$this->_field()];
    }

    public function calculateSum($currentSum, $sum)
    {
        if ($this->getHistoryInfo()->getIncrease() == 'up') {
            return $currentSum - $sum;
        }
        return $currentSum + $sum;
    }
}