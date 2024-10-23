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

            $users = $this->userRepo->getUsersWhichHasPaymentHistory($id_user, $cashbox);

            foreach ($users as $user) {
                $cashboxField = $this->getFieldByCashbox($cashbox);


                $initialBallance = $this->countInitialBallance(
                    $user->{$cashboxField}, $user->payment_history
                );

                $update = [];
                foreach ($user->payment_history as $item) {
                    $sum = $item->sum;
                    $initialBallance = $item->increase == 'up' ? $initialBallance + $sum : $initialBallance - $sum;

                    $update[] = [
                        'id'       => $item->id,
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
     * @return string
     */
    private function getFieldByCashbox($cashbox)
    {
        return match ($cashbox) {
            'ballance'       => 'ballance',
            'deposit'        => 'deposit',
            'penalty'        => 'penalty_ballance',
            'purchase_limit' => 'purchase_ballance',
        };
    }

    /**
     * @param $id_user
     * @param $cashbox
     * @param $currentBallance
     * @return \Illuminate\Database\Eloquent\HigherOrderBuilderProxy|mixed
     */
    private function countInitialBallance($currentBallance, $payment_history)
    {
        $records = $payment_history->sortBy(['date', 'id']);

        foreach ($records as $item) {
            $sum = $item->sum;
            $currentBallance = $item->increase == 'up' ? $currentBallance - $sum : $currentBallance + $sum;
        }

        return $currentBallance;
    }
}
