<?php

namespace App\Services\User\Payment\Middleware;

use App\Enum\CashboxActionEnum;
use App\Models\User;
use App\Services\User\Payment\Enums\CashboxEnum;
use App\Services\User\Payment\Middleware\Interfaces\BeforeTransaction;
use Closure;
use App\Services\User\Payment\Middleware\Core\PaymentMiddlewareDto;
use App\Services\User\Payment\Middleware\Core\PaymentMiddleware;

class VerifyResellerDepositExtractionPaymentMiddleware extends PaymentMiddleware implements BeforeTransaction
{
    protected $cashboxAccess = CashboxEnum::DEPOSIT;

    public function auth(User $user): bool
    {
        return $user->hasResellerCustomers();
    }

    /**
     * Запретить списание депозита перекупа если его средства распределены по его клиентам
     * а сумма для списания превышает его свободные средства
     *
     * @param PaymentMiddlewareDto $params
     * @param Closure $next
     * @return mixed
     * @throws \App\Exceptions\ControlledException
     */
    public function beforeTransactionHandler(PaymentMiddlewareDto $params, Closure $next)
    {
        $user = $params->user;
        if ($params->action == CashboxActionEnum::EXTRACT) {
            if ($user->freeDeposit(true) < $params->amount) {
                throwControled('Обратитесь к перекупу');
            }
        }

        return $next($params);
    }
}