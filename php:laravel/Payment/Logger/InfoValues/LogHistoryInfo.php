<?php

namespace App\Services\User\Payment\Logger\InfoValues;

use App\Models\User;

class LogHistoryInfo implements LogHistoryInfoInterface
{
    /**
     * @var User
     */
    private $user;

    /**
     * @var User|null
     */
    private $admin;

    /**
     * @var string
     */
    private $increase;

    /**
     * @var float
     */
    private $amount;

    /**
     * @var string
     */
    private $date;

    /**
     * @var int
     */
    private $id;

    /**
     * @var int
     */
    private $id_service;

    /**
     * @var array
     */
    private $ctx = [];

    /**
     * @param  User  $user
     * @return $this
     */
    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @param  User  $admin
     * @return $this
     */
    public function setAdmin(?User $admin): self
    {
        $this->admin = $admin;
        return $this;
    }

    /**
     * @param  string  $value
     * @return $this
     */
    public function setIncrease(string $value): self
    {
        $this->increase = $value;
        return $this;
    }

    /**
     * @param  float  $value
     * @return $this
     */
    public function setAmount(float $value): self
    {
        $this->amount = $value;
        return $this;
    }

    /**
     * @param  mixed  $value
     * @return $this
     */
    public function setDate(mixed $value): self
    {
        $his = carbonCreate($value, "H:i:s");
        if ($his == '00:00:00') {
            $his = now()->format('H:i:s');
        }

        $this->date = carbonCreate($value) . " $his";
        return $this;
    }

    /**
     * @param  int  $value
     * @return $this
     */
    public function setId(int $value): self
    {
        $this->id = $value;
        return $this;
    }

    /**
     * @param  int  $value
     * @return $this
     */
    public function setServiceId(int $value): self
    {
        $this->id_service = $value;
        return $this;
    }

    /**
     * @param array $ctx
     * @return $this
     */
    public function setCtx(array $ctx = []): self
    {
        $this->ctx = $ctx;
        return $this;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @return User
     */
    public function getAdmin(): ?User
    {
        return $this->admin;
    }

    /**
     * @return string
     */
    public function getIncrease(): string
    {
        return $this->increase;
    }

    /**
     * @return float
     */
    public function getAmount(): float
    {
        return $this->amount;
    }

    /**
     * @return string|null
     */
    public function getDate(): string|null
    {
        return $this->date;
    }

    /**
     * @return int|null
     */
    public function getId(): int|null
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getServiceId(): int
    {
        return $this->id_service;
    }

    /**
     * @return array
     */
    public function getCtx(): array
    {
        return $this->ctx;
    }
}