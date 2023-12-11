<?php

namespace App\Services\User\Payment\Logger\InfoValues;

/**
 * @see LogHistoryInfo
 */
interface LogHistoryInterface
{
    public function setDate(mixed $value): self;

    public function setId(int $value): self;

    public function setServiceId(int $value): self;
}