<?php

namespace App\Services\User\Payment\Logger\Services\Customer\Ballance;

use App\Models\Payment\PaymentHistory;
use App\Services\Subscription\Bot\Core\SubscriptionResultDto;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class BallanceSubscriptionFeeLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    public function __construct(
        private SubscriptionResultDto $resultDto
    ) {}

    protected $logServiceType = PaymentActionEnum::SUBSCRIPTION_FEE;

    protected $description = 'SubscriptionAbstract fee';

    public function save()
    {
        if (!$this->resultDto->startOfMonth) {
            throwE('Undefined startOfMonth param');
        }

        $historyInfo = $this->getHistoryInfo();

        $user       = $historyInfo->getUser();
        $id_service = $historyInfo->getServiceId();

        $history    = $this->repository()->getSubscriptionHistory(
            $user->id, $id_service, $this->resultDto->startOfMonth
        );

        if ($history) {
            $this->updatePaymentHistory($history);
            return;
        }

        $this->createPaymentHistory($id_service);
    }

    private function createPaymentHistory($id_service)
    {
        DB::table('payment_history')->insert([
            ...$this->_baseParams(),
            'id_service'  => $id_service,
            'start_month' => $this->resultDto->startOfMonth,
            'percent'     => $this->resultDto->percent
        ]);
    }

    protected function updatePaymentHistory(PaymentHistory $existedRecord)
    {
        $historyInfo = $this->getHistoryInfo();
        $sum  = $historyInfo->getAmount();

        if ($sum == 0) {
            $this->repository()->delete($existedRecord->id);
        } else {
            $this->repository()->update([
                'date'       => $historyInfo->getDate() ?: $existedRecord->date,
                'sum'        => $sum,
                'ballance'   => $this->getUserBallanceFieldVal()
            ], $existedRecord->id);
        }
    }
}