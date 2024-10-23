<?php

namespace App\Services\User\Payment\Logger\Services\Customer\PurchaseLimit;

use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use App\Services\User\Payment\Logger\Services\Traits\BallanceLogServiceTrait;
use Illuminate\Support\Facades\DB;

class MainLogService extends ServiceLog
{
    use BallanceLogServiceTrait;

    protected $logServiceType = [
        PaymentActionEnum::preorder_money_deposited,
        PaymentActionEnum::discounted_money_deposited,
        PaymentActionEnum::preorder_purchase,
        PaymentActionEnum::discounted_purchase,
        PaymentActionEnum::in_fact_purchase,
        PaymentActionEnum::add_penalty,
        PaymentActionEnum::preorder_recalculation,
        PaymentActionEnum::return_penalty,
        PaymentActionEnum::create_p2p_bid,
        PaymentActionEnum::update_p2p,
        PaymentActionEnum::update_qty_p2p,
        PaymentActionEnum::update_price_p2p,
        PaymentActionEnum::delete_p2p,
        PaymentActionEnum::change_warranty,
        PaymentActionEnum::charge_deposit,
        PaymentActionEnum::extract_deposit,
        PaymentActionEnum::update_payment_type,
        PaymentActionEnum::rewrite_after_recalculate,
        PaymentActionEnum::update_field,
        PaymentActionEnum::rewrite_in_fact
    ];

    public function save()
    {
        $historyInfo = $this->getHistoryInfo();
        $user = $historyInfo->getUser();

        DB::table('payment_history')->insert([
            ...$this->_baseParams(),
            'ctx' => $this->prepareCtx(new: [
                ...$historyInfo->getCtx(),
                'payment_type' => $user->payment_type
            ]),
            'id_service' => $historyInfo->getServiceId()
        ]);
    }

    public function calculateSum($currentSum, $sum)
    {
        return null;
    }
}