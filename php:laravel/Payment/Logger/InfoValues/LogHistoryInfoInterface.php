<?php

namespace App\Services\User\Payment\Logger\InfoValues;

use App\Models\User;

/**
 * @see LogHistoryInfo
 */
interface LogHistoryInfoInterface extends LogHistoryInterface
{
    public function setUser(User $user): self;

    public function setAdmin(User $admin): self;

    public function setIncrease(string $value): self;

    public function setAmount(float $value): self;

    public function setCtx(array $ctx = []): self;

    public function getUser(): User;

    public function getAdmin(): ?User;

    public function getIncrease(): string;

    public function getAmount(): float;

    public function getDate(): string|null;

    public function getId(): int|null;

    public function getServiceId(): int;

    public function getCtx(): array;
}