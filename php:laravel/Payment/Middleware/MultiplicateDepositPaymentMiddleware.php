<?php

namespace App\Services\User\Payment\Middleware;

use App\Enum\CashboxActionEnum;
use App\Models\User;
use App\Services\Catalog\P2p\P2pService;
use App\Services\User\Payment\Enums\CashboxEnum;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInfo;
use App\Services\User\Payment\Middleware\Interfaces\AfterTransaction;
use App\Services\User\Payment\Payment;
use Closure;
use App\Services\User\Payment\Middleware\Core\PaymentMiddlewareDto;
use App\Services\User\Payment\Middleware\Core\PaymentMiddleware;

/**
 * Определяем лимит клиента на покупку исходя из суммы депозита
 */
class MultiplicateDepositPaymentMiddleware extends PaymentMiddleware implements AfterTransaction
{
    protected $cashboxAccess = CashboxEnum::DEPOSIT;

    public function __construct(
        private P2pService $p2pService
    ) {}

    public function auth(User $user): bool
    {
        return $user->isClient() || $user->isResellerClient();
    }

    public function afterTransactionHandler(PaymentMiddlewareDto $params, Closure $next)
    {
        $user          = $params->user;
        $action        = $params->action;
        $amount        = $params->amount;

        $purchaseAmount = $amount * setting('deposit_multiplicator');

        if ($action == CashboxActionEnum::CHARGE) {
            $ctx = [
                'prevDeposit' => $user->deposit - $amount,
                'newDeposit'  => $user->deposit
            ];

            $updatedUser = Payment::purchaseLimitCashbox($user)
                                  ->charge($purchaseAmount)
                                  ->log(PaymentActionEnum::charge_deposit, callback: function (LogHistoryInfo $m) use ($ctx) {
                                        $m->setCtx($ctx);
                                    })->getUpdatedUser();

        } else {
            $purchaseAmount = $amount * setting('deposit_multiplicator');

            $user = $this->extractMissingPurchaseBalanceFromP2pOrders($user, $purchaseAmount);

            $ctx = [
                'prevDeposit' => $user->deposit + $amount,
                'newDeposit'  => $user->deposit
            ];

            $updatedUser = Payment::purchaseLimitCashbox($user)
                                ->extract($purchaseAmount)
                                ->log(PaymentActionEnum::extract_deposit, callback: function (LogHistoryInfo $m) use ($ctx) {
                                    $m->setCtx($ctx);
                                })->getUpdatedUser();
        }

        $params->setField('user', $updatedUser);

        return $next($params);
    }

    private function extractMissingPurchaseBalanceFromP2pOrders(User $user, $purchaseAmount): User
    {
        $total = $user->freePurchaseBallance() - $purchaseAmount;
        if ($total < 0) {
            // удаляем заявки и возвращаем недостающий лимит
            $diff = abs($total);

            $deletionResp = $this->p2pService->deleteBidsOnDepositDecrease(
                $user->id, $diff
            );

            $purchaseLimitToReturn = $deletionResp->getPurchaseLimitToReturn();
            if ($purchaseLimitToReturn) {
                $user = Payment::purchaseLimitCashbox($user)
                                ->charge($purchaseLimitToReturn)
                                ->log(PaymentActionEnum::charge_deposit, callback: function (LogHistoryInfo $m) use ($deletionResp) {
                                    $m->setCtx(
                                        ['ids' => $deletionResp->getTouchedIds(), 'info' => 'deleteBidsOnDepositDecrease']
                                    );
                                })->getUpdatedUser();
            }
        }

        return $user;
    }
}