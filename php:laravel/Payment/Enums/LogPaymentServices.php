<?php

namespace App\Services\User\Payment\Enums;

class LogPaymentServices
{
    const CASH_RECEIPT = 'cash_receipt';
    const SUPPLIER_PENALTY = 'supplier_penalty';
    const CASH_REFUND = 'cash_refund';
    const PAYMENT_FOR_DOCUMENTS = 'payment_for_documents';
    const CUSTOMER_PENALTY = 'customer_penalty';
    const SUBSCRIPTION_FEE = 'subscription_fee';
    const RETURN_PRODUCTS = 'return_products';
}