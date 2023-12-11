<?php

namespace App\Services\User\Payment\Cashbox\SupplierCashbox;

use App\Models\User;
use App\Services\User\Payment\Cashbox\CashboxInterface;
use App\Services\User\Payment\Cashbox\Traits\BallanceCashboxTrait;

class BallanceCashbox implements CashboxInterface
{
    use BallanceCashboxTrait;

    /**
     * @param  User  $user
     * @param  float  $newBallance
     * @return User
     */
    protected function saveBallance(User $user, float $newBallance): User
    {
        $user->update(['ballance' => $newBallance]);

        return $user;
    }
}