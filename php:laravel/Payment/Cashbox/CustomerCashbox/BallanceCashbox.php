<?php

namespace App\Services\User\Payment\Cashbox\CustomerCashbox;

use App\Models\User;
use App\Services\User\Customer\CustomerService;
use App\Services\User\Payment\Cashbox\CashboxInterface;
use App\Services\User\Payment\Cashbox\Traits\BallanceCashboxTrait;

class BallanceCashbox implements CashboxInterface
{
    use BallanceCashboxTrait;

    /**
     * @param  User  $user
     * @param $newBallance
     * @return User
     */
    protected function saveBallance(User $user, $newBallance): User
    {
        $currentBallance = $user->ballance;
        $user->update(['ballance' => $newBallance]);

        if ($newBallance >= 0 && $currentBallance < 0 && !$user->inBlackList()) {
            app(CustomerService::class)->switchStatus(
                $user->id,
                $user->prev_status ?: 'active'
            );
        }

        if($newBallance < 0 && !$user->inBlackList()){
            app(CustomerService::class)->switchStatus(
                $user->id,
                'blocked'
            );
        }

        return $user;
    }
}