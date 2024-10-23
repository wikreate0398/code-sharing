<?php

namespace App\Services\User\Payment\Cashbox;

use App\Models\User;

abstract class AbstractCashbox
{
    protected $field = 'ballance'; // by default

    /**
     * @param  User  $user
     * @param  float  $amount
     * @return User
     */
    public abstract function charge(User $user, float $amount): User;

    /**
     * @param  User  $user
     * @param  float  $amount
     * @return User
     */
    public abstract function extract(User $user, float $amount): User;

    /**
     * Название поля в бд
     *
     * @return string
     */
    public function getField(): string
    {
        return $this->field;
    }
}