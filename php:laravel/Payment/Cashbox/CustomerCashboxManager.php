<?php

namespace App\Services\User\Payment\Cashbox;

use App\Services\User\Payment\Cashbox\CustomerCashbox\BallanceCashbox;
use App\Services\User\Payment\Cashbox\CustomerCashbox\DepositCashbox;
use App\Services\User\Payment\Cashbox\CustomerCashbox\PenaltyCashbox;
use App\Services\User\Payment\Cashbox\CustomerCashbox\PurchaseLimitCashbox;

class CustomerCashboxManager extends AbstractUserCashboxManager implements UserCashboxManagerInterface
{
    /**
     * @param  string  $cashbox
     * @return mixed|void
     */
    public function cashbox(string $cashbox)
    {
        $this->setCashbox($cashbox);

        $this->logger->cashbox($cashbox);

        $this->cashboxManager = app(match ($cashbox) {
            'ballance'       => BallanceCashbox::class,
            'deposit'        => DepositCashbox::class,
            'penalty'        => PenaltyCashbox::class,
            'purchase_limit' => PurchaseLimitCashbox::class,
        });
    }
}