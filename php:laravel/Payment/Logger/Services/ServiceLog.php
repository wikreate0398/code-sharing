<?php

namespace App\Services\User\Payment\Logger\Services;

use App\Repository\Interfaces\PaymentRepositoryInterface;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInfoInterface;

abstract class ServiceLog implements PaymentLogServiceInterface
{
    private string $cashbox;

    /**
     * @var LogHistoryInfoInterface
     */
    private $historyInfo;

    public function setCashbox(string $cashbox)
    {
        $this->cashbox = $cashbox;
        return $this;
    }

    public function setHistoryInfo(LogHistoryInfoInterface $obj)
    {
        $this->historyInfo = $obj;
        return $this;
    }

    public function getCashbox(): string
    {
        return $this->cashbox;
    }

    public function getHistoryInfo(): LogHistoryInfoInterface
    {
        return $this->historyInfo;
    }

    public function repository(): PaymentRepositoryInterface
    {
        return app(PaymentRepositoryInterface::class);
    }

    public abstract function save();

    public abstract function calculateSum($currentSum, $sum);
}