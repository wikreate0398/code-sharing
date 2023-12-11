<?php

namespace App\Services\User\Payment;

use App\Repository\Interfaces\PaymentRepositoryInterface;

class PaymentHistoryService
{
    /**
     * @param  PaymentRepositoryInterface  $repository
     */
    public function __construct(
        private PaymentRepositoryInterface $repository
    ) {}

    /**
     * @param $id_from
     * @param $id_to
     */
    public function movePreorderProduct($id_from, $id_to)
    {
        $this->repository->movePreorderProduct($id_from, $id_to);
    }
}