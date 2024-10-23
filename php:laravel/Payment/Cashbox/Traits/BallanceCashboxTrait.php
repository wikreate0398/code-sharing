<?php

namespace App\Services\User\Payment\Cashbox\Traits;

use App\Models\User;

trait BallanceCashboxTrait
{
    /**
     * @param  User  $user
     * @param $amount
     * @return User
     */
    public function charge(User $user, $amount): User
    {
        $newBallance = $user->{$this->field} + $amount;
        return $this->saveBallance($user, $newBallance);
    }

    /**
     * @param  User  $user
     * @param $amount
     * @return User
     */
    public function extract(User $user, $amount): User
    {
        $newBallance = $user->{$this->field} - $amount;
        return $this->saveBallance($user, $newBallance);
    }
}