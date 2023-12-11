<?php

namespace App\Services\User\Payment\Cashbox;

use App\Models\User;

interface CashboxInterface
{
    /**
     * @param  User  $user
     * @param  float  $amount
     * @return User
     */
    public function charge(User $user, float $amount): User;

    /**
     * @param  User  $user
     * @param  float  $amount
     * @return User
     */
    public function extract(User $user, float $amount): User;
}