<?php

namespace App\Services\User\Payment\Logger;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\PaymentLogServiceInterface;

class RewriteLogger
{
    /**
     * @var PaymentActionEnum|PaymentLogServiceInterface
     */
    private $loggerService;

    /**
     * @var ?callable
     */
    private $optionsHandler;

    /**
     * @param PaymentActionEnum|PaymentLogServiceInterface $loggerService
     * @return void
     */
    public function logType(PaymentActionEnum|PaymentLogServiceInterface $loggerService): self
    {
        $this->loggerService = $loggerService;
        return $this;
    }

    /**
     * @param callable|null $callback
     * @return $this
     */
    public function logOptionsHandler(callable $callback = null): self
    {
        $this->optionsHandler = $callback;
        return $this;
    }

    /**
     * @return PaymentActionEnum|PaymentLogServiceInterface
     */
    public function getLoggerService()
    {
        return $this->loggerService;
    }

    /**
     * @return callable|null
     */
    public function getLogOptionsHandler()
    {
        return $this->optionsHandler;
    }
}