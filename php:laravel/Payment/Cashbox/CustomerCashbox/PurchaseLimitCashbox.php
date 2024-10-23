<?php

namespace App\Services\User\Payment\Cashbox\CustomerCashbox;

use App\Models\User;
use App\Services\User\Payment\Cashbox\AbstractCashbox;
use App\Services\User\Payment\Cashbox\Traits\BallanceCashboxTrait;

class PurchaseLimitCashbox extends AbstractCashbox
{
    protected $field = 'purchase_ballance';

    use BallanceCashboxTrait;

    /**
     * @param  User  $user
     * @param $newBallance
     * @return User
     */
    protected function saveBallance(User $user, $newBallance): User
    {
        $user->update([$this->field => $newBallance]);
        return $user;
    }
}