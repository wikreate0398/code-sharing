<?php

namespace App\Services\User\Payment\Cashbox\CustomerCashbox;

use App\Models\User;
use App\Services\User\Payment\Cashbox\CashboxInterface;

class DepositCashbox implements CashboxInterface
{
    /**
     * @var float|array|mixed|string
     */
    private float $multiplicator;

    /**
     *
     */
    public function __construct()
    {
        $this->multiplicator = setting('deposit_multiplicator');
    }

    /**
     * @param  User  $user
     * @return int
     */
    private function debtPurchaseLimit(User $user)
    {
        return 0;
    }

    /**
     * @param  User  $user
     * @param  float  $amount
     * @return User
     */
    public function charge(User $user, float $amount): User
    {
        $debtPurchaseLimit = $this->debtPurchaseLimit($user);
        $newDeposit = $user->deposit + $amount;

        $user->update([
            'deposit' => $newDeposit,
            'purchase_ballance' => $user->purchase_ballance + ($amount * $this->multiplicator - $debtPurchaseLimit)
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
        $newDeposit = $user->deposit - $amount;

        $user->update([
            'deposit' => $newDeposit,
            'purchase_ballance' => $user->purchase_ballance - $amount * setting('deposit_multiplicator')
        ]);

        return $user;
    }
}