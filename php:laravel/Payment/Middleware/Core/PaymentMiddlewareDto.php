<?php

namespace App\Services\User\Payment\Middleware\Core;

use App\Dto\DataTransferObject;
use App\Dto\DtoTrait;
use App\Enum\CashboxActionEnum;
use App\Models\User;
use App\Services\User\Payment\Enums\CashboxEnum;

class PaymentMiddlewareDto extends DataTransferObject
{
    /**
     * @var User
     */
    public $user;

    /**
     * @var CashboxActionEnum
     */
    public $action;

    /**
     * @var CashboxEnum
     */
    public $cashbox;

    /**
     * @var float
     */
    public $amount;

    use DtoTrait;
}