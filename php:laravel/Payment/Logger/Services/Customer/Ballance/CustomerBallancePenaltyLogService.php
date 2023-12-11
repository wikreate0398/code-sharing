<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Ballance;

use App\Repository\Interfaces\PenaltyRepositoryInterface;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class CustomerBallancePenaltyLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    public function __construct(
        private $id_preorder = null,
        private $status = false
    ) {}

    protected $logServiceType = 'customer_penalty';

    protected $description = 'Penalty customer - info';

    public function save()
    {
        $historyInfo = $this->getHistoryInfo();
        $user = $historyInfo->getUser();
        $paymentHistory = $this->repository()->getPenaltyPaymentHistory(
            $this->id_preorder, $user->id, 'client'
        );

        $id_service = $historyInfo->getServiceId();

        if (!$paymentHistory) {
            DB::table('payment_history')->insert([
                ...$this->_baseParams(),
                'id_service'  => $id_service,
                'id_preorder' => $this->id_preorder
            ]);
        } else {
            $diff     = $historyInfo->getAmount();
            $increase = $historyInfo->getIncrease();
            $sum      = $this->calculateSum($paymentHistory->sum, $diff);

            $penaltyRepo = app(PenaltyRepositoryInterface::class);

            if ($sum == 0 && !$penaltyRepo->hasPriceError($this->id_preorder) && $this->status !== 'price_error') {
                $this->repository()->delete($paymentHistory->id);
            } else {
                $this->repository()->update([
                    'date'       => $historyInfo->getDate() ?: $paymentHistory->date,
                    'sum'        => $sum,
                    'ballance'   => $increase == 'up' ? $paymentHistory->ballance + $diff
                        : $paymentHistory->ballance - $diff
                ], $paymentHistory->id);
            }
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