export interface X402PaymentRequiredHeader {
    /** Base64-encoded PaymentRequirements object */
    'PAYMENT-REQUIRED': string;
}
export interface X402PaymentSignatureHeader {
    /** Base64-encoded PaymentPayload object */
    'PAYMENT-SIGNATURE': string;
}
export interface X402PaymentResponseHeader {
    /** Base64-encoded SettlementResponse object (on success) */
    'PAYMENT-RESPONSE'?: string;
}
export interface PaymentRequirements {
    x402Version: string;
    accepts: PaymentAccept[];
}
export interface PaymentAccept {
    scheme: string;
    network: string;
    asset: string;
    amount: string;
    payTo: string;
    reference: string;
    description: string;
    resource: string;
}
export interface PaymentPayload {
    x402Version: string;
    scheme: string;
    network: string;
    signature: string;
    account: string;
}
export interface SettlementResponse {
    success: boolean;
    transactionId: string;
    settledAt: string;
}
