<?php

namespace App\Services\User\Payment\Cashbox;

use App\Services\User\Payment\Cashbox\SupplierCashbox\BallanceCashbox;

class SupplierCashboxManager extends AbstractUserCashboxManager implements UserCashboxManagerInterface
{
    /**
     * @param  string  $cashbox
     * @return mixed|void
     */
    public function cashbox(string $cashbox = 'ballance')
    {
        $this->logger->cashbox($cashbox);
        $this->cashboxManager = app(BallanceCashbox::class);
    }
}