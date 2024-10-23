<?php

namespace App\Services\User\Payment\Middleware;

use App\Enum\CashboxActionEnum;
use App\Models\User;
use App\Services\User\Payment\Enums\CashboxEnum;
use App\Services\User\Payment\Middleware\Interfaces\BeforeTransaction;
use Closure;
use App\Services\User\Payment\Middleware\Core\PaymentMiddlewareDto;
use App\Services\User\Payment\Middleware\Core\PaymentMiddleware;

/**
 * При распределении депозита перекупа своим клиентам
 */
class CanRewriteResellerClientDepositPaymentMiddleware extends PaymentMiddleware implements BeforeTransaction
{
    protected $cashboxAccess = CashboxEnum::DEPOSIT;

    public function __construct() {}

    public function auth(User $user): bool
    {
        return $user->isResellerClient();
    }

    public function beforeTransactionHandler(PaymentMiddlewareDto $params, Closure $next)
    {
        $user   = $params->user;
        $action = $params->action;
        $amount = $params->amount;

        $purchaseAmount = $amount * setting('deposit_multiplicator');

        if ($action == CashboxActionEnum::EXTRACT) {
            // ограничение на минусовой баланс
             if ($user->freePurchaseBallance() - $purchaseAmount < 0 ) {
                throwControled('Недостаточно средств');
             }
        } else if ($action == CashboxActionEnum::CHARGE) {
            // проверка наличия средств у перекупа
            $reseller = $user->reseller;
            if ($reseller->freeDeposit(true) < $amount ||
                $reseller->freePurchaseBallance(true) - $purchaseAmount < 0
            ) {
                throwControled('Недостаточно средств');
            }
        }

        return $next($params);
    }
}