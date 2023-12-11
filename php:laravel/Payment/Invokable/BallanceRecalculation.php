<?php

namespace App\Services\User\Payment\Invokable;

use App\Http\Controllers\Traits\TransactionDB;
use App\Repository\Interfaces\PaymentRepositoryInterface;
use App\Repository\Interfaces\UserRepositoryInterface;

class BallanceRecalculation
{
    use TransactionDB;

    /**
     * @param  PaymentRepositoryInterface  $paymentRepo
     * @param  UserRepositoryInterface  $userRepo
     */
    public function __construct(
        private PaymentRepositoryInterface $paymentRepo,
        private UserRepositoryInterface $userRepo,
    ) {}

    /**
     * @param  null  $id_user
     * @param  string  $cashbox
     */
    public function recalculate($id_user = null, $cashbox = 'ballance')
    {
        $clbk = function () use ($id_user, $cashbox) {
            foreach ($this->userRepo->getUsersWhichHasPaymentHistory($id_user, $cashbox) as $user) {
                $initialBallance = $this->countInitialBallance(
                    $user->id, $cashbox, $this->getValByCashbox($user, $cashbox)
                );

                $update = [];
                foreach ($this->paymentRepo->getUserPaymentInfo($user->id, $cashbox) as $item) {
                    $sum = $item->sum;
                    $initialBallance = $item->increase == 'up' ? $initialBallance + $sum : $initialBallance - $sum;

                    $update[] = [
                        'id' => $item->id,
                        'ballance' => $initialBallance
                    ];
                }

                $this->paymentRepo->batchUpdate($update);
            }
        };

        $this->transaction($clbk, 2);
    }

    /**
     * @param $user
     * @param $cashbox
     * @return mixed
     */
    private function getValByCashbox($user, $cashbox)
    {
        return match ($cashbox) {
            'ballance' => $user->ballance,
            'deposit' => $user->deposit,
            //'penalty' => null,
        };
    }

    /**
     * @param $id_user
     * @param $cashbox
     * @param $currentBallance
     * @return \Illuminate\Database\Eloquent\HigherOrderBuilderProxy|mixed
     */
    private function countInitialBallance($id_user, $cashbox, $currentBallance)
    {
        $records = $this->paymentRepo->getRecordsByParams(
            compact('id_user', 'cashbox'), 'id,increase,sum'
        );

        foreach ($records as $item) {
            $sum = $item->sum;
            $currentBallance = $item->increase == 'up' ? $currentBallance - $sum : $currentBallance + $sum;
        }

        return $currentBallance;
    }
}
