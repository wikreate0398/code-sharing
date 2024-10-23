<?php

namespace App\Services\User\Payment\Cashbox\SupplierCashbox;

use App\Models\User;
use App\Services\User\Payment\Cashbox\AbstractCashbox;
use App\Services\User\Payment\Cashbox\Traits\BallanceCashboxTrait;

class BallanceCashbox extends AbstractCashbox
{
    protected $field = 'ballance';

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