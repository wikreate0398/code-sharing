<?php

namespace App\Services\User\Payment\Enums;

Enum CashboxEnum: string
{
    case DEPOSIT = 'deposit';
    case BALLANCE = 'ballance';
    case PENALTY = 'penalty';
}
