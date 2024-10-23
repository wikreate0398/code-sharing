<?php

namespace App\Services\User\Payment\Cashbox\CustomerCashbox;

use App\Models\User;
use App\Services\Catalog\P2p\P2pService;
use App\Services\User\Payment\Cashbox\AbstractCashbox;

class DepositCashbox extends AbstractCashbox
{
    protected $field = 'deposit';

    /**
     * @param  User  $user
     * @param  float  $amount
     * @return User
     */
    public function charge(User $user, float $amount): User
    {
        $newDeposit = $user->{$this->field} + $amount;

        $user->update([
            "$this->field" => $newDeposit,
        ]);

        return $user;
    }

    /**
     * @param  User  $user
     * @param  float  $amount
     * @return User
     */
    public function extract(User $user, float $amount): User
    {
        $newDeposit = $user->{$this->field} - $amount;

        $user->update([
            "$this->field" => $newDeposit,
        ]);

        return $user;
    }
}