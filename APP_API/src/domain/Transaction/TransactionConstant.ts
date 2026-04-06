export enum TransactionIdentifier {
    PAYMENT_INTENT = 'PAYMENT_INTENT', // For transactions associated with Payment Intents
    TRANSFER = 'TRANSFER', // For fund transfers to connected accounts
    REFUND = 'REFUND', // For refunds
    PAYOUT = 'PAYOUT', // For payouts to bank accounts
    DISPUTE = 'DISPUTE', // For disputes
    TOPUP = 'TOPUP', // For user top-up transactions
    CARD_CHARGE = 'CARD_CHARGE', // For user top-up transactions
    WALLET_TRANSFER = 'WALLET_TRANSFER', // For user top-up transactions
    CARD_TRANSFER = 'CARD_TRANSFER', // For user top-up transactions
    VENDOR_SUBSCRIPTION = 'VENDOR_SUBSCRIPTION' // For vendor subscription purchases
}

export enum TransactionType {
    PAYMENT = 'PAYMENT', // Standard payment
    TRANSFER_TO_CONNECT = 'TRANSFER_TO_CONNECT', // Transfer to connected account
    REFUND = 'REFUND', // Refund transaction
    PAYOUT = 'PAYOUT', // Payout to bank
    DISPUTE_RESOLUTION = 'DISPUTE_RESOLUTION', // Dispute resolution transaction
    USER_TOPUP = 'USER_TOPUP', // Top-up for user account balance
    VENDOR_SUBSCRIPTION_PURCHASE = 'VENDOR_SUBSCRIPTION_PURCHASE' // Vendor subscription purchase
}


export enum TransactionAction {
    ADD = 'ADD', // Standard payment
    DEDUCT = 'DEDUCT', // Transfer to connected account
    
}
