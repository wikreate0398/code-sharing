<?php

namespace App\Services\User\Payment\Enums;

enum PaymentActionEnum: string
{
    case CASH_RECEIPT = 'cash_receipt';

    case CASH_REFUND = 'cash_refund';
    case SUPPLIER_PENALTY = 'supplier_penalty';
    case PAYMENT_FOR_DOCUMENTS = 'payment_for_documents';
    case CUSTOMER_PENALTY = 'customer_penalty';
    case RETURN_PRODUCTS = 'return_products';
    case ORDER_PAYMENT = 'order_payment';

    case SUBSCRIPTION_FEE = 'subscription_fee';
    case BONUS_RECEIPT = 'bonus_receipt';

    // purchase limit
    case preorder_money_deposited = 'preorder_money_deposited';

    case preorder_recalculation = 'preorder_recalculation';
    case discounted_money_deposited = 'discounted_money_deposited';

    case preorder_purchase = 'preorder_purchase';

    case in_fact_purchase = 'in_fact_purchase';
    case discounted_purchase = 'discounted_purchase';
    case add_penalty = 'add_penalty';

    case return_penalty = 'return_penalty';

    case create_p2p_bid = 'create_p2p_bid';

    case update_p2p = 'update_p2p';
    case update_qty_p2p = 'update_qty_p2p';

    case update_price_p2p = 'update_price_p2p';

    case delete_p2p = 'delete_p2p';

    case change_warranty = 'change_warranty';

    case charge_deposit = 'charge_deposit';

    case extract_deposit = 'extract_deposit';

    case update_payment_type = 'update_payment_type';

    case rewrite_after_recalculate = 'rewrite_after_recalculate';

    case rewrite_in_fact = 'rewrite_in_fact';

    case reset = 'reset';

    case update_field = 'update_field';
}