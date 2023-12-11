<?php

namespace App\Services\User\Payment\Crud;

use App\Dto\PaymentHistoryManageDto;
use App\Http\Controllers\Traits\TransactionDB;
use App\Models\Payment\PaymentHistory;
use App\Repository\Interfaces\PaymentRepositoryInterface;
use App\Repository\Interfaces\UserRepositoryInterface;
use App\Services\BaseService;
use App\Services\User\Payment\Enums\LogPaymentServices;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInterface;
use App\Services\User\Payment\Payment;

class AbstractBallanceService extends BaseService
{
    use TransactionDB;

    /**
     * @var string
     */
    protected $cashReceiptService = LogPaymentServices::CASH_RECEIPT;

    /**
     * @var string
     */
    protected $cashRefundService = LogPaymentServices::CASH_REFUND;

    /**
     * @var
     */
    protected $strategyType;

    /**
     * @param  PaymentHistory  $model
     * @param  PaymentRepositoryInterface  $repository
     * @param  UserRepositoryInterface  $userRepository
     */
    public function __construct(
        PaymentHistory $model,
        PaymentRepositoryInterface $repository,
        private UserRepositoryInterface $userRepository
    )
    {
        parent::__construct($model, $repository);
    }

    /**
     * @param  PaymentHistoryManageDto  $dto
     * @throws \Exception
     */
    public function create(PaymentHistoryManageDto $dto)
    {
        try {
            $this->beginTransaction();
            if (!$dto->sum || !$dto->id_user) {
                throw new \Exception('Заполните все поля');
            }

            $new_sum = $dto->sum;
            $id_user = $dto->id_user;
            $type    = $dto->type;

            $payment = Payment::cashbox(
                $dto->cashbox, $this->userRepository->find($id_user)
            );

            if ($type == LogPaymentServices::CASH_RECEIPT) {
                $payment->charge($new_sum);
            } else {
                $payment->extract($new_sum);
            }

            $payment->log($type,
                callback: fn (LogHistoryInterface $historyInfo) => $historyInfo->setDate(now()->format('H:i:s'))
            );

            $this->commit();
        } catch (\Exception $exception) {
            $this->rollback();
            throw $exception;
        }
    }

    /**
     * @param $id
     * @param  PaymentHistoryManageDto  $dto
     * @param  bool  $checkManage
     * @throws \Exception
     */
    public function update($id, PaymentHistoryManageDto $dto, $checkManage = true)
    {
        try {
            $this->beginTransaction();

            if (!$dto->sum) {
                throw new \Exception('Укажите сумму');
            }

            $data = $this->model->with(['user', 'service'])->findOrFail($id);
            $user = $data->user;

            $new_sum = $dto->sum;
            $date    = carbonCreate($dto->date);

            if ($new_sum == $data->sum) {
                PaymentHistory::whereId($id)->update(['date' => $date]);
                return;
            }

            $payment = Payment::cashbox(
                $data->cashbox, $user
            );

            if ($data->sum < $new_sum) {
                $sum = $new_sum - $data->sum;
                if ($data->service->define == $this->cashRefundService) {
                    $payment->extract($sum);
                } else {
                    $payment->charge($sum);
                }
            } else {
                $sum = $data->sum - $new_sum;
                if ($data->service->define == $this->cashRefundService) {
                    $payment->charge($sum);
                } else {
                    $payment->extract($sum);
                }
            }

            $payment->log($data->service->define,
                callback: fn (LogHistoryInterface $historyInfo) => $historyInfo->setDate($date)->setId($id)
            );

            $this->commit();
        } catch (\Exception $exception) {
            $this->rollback();
            throw $exception;
        }
    }

    /**
     * @param $id
     * @throws \Exception
     */
    public function delete($id)
    {
        try {
            $this->beginTransaction();

            $data = $this->model->with(['user', 'service'])->findOrFail($id);
            $user = $data->user;

            $payment = Payment::cashbox(
                $data->cashbox, $user
            );

            $logServiceType = $data->service->define;

            if ($logServiceType == $this->cashRefundService) {
                $payment->charge($data->sum);
            } else {
                $payment->extract($data->sum);
            }

            $payment->log($logServiceType,
                callback: fn (LogHistoryInterface $historyInfo) => $historyInfo->setId($id)
            );

            $data->delete();
            $this->commit();
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
}
