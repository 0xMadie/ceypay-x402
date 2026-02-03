// X402 Protocol Types for Solana

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
  scheme: string; // e.g. 'exact', 'channel'
  network: string; // e.g. 'solana:101'
  asset: string; // SPL Token mint address
  amount: string; // Amount in smallest denomination (e.g. lamports for SOL, or 1e6 for USDC)
  payTo: string; // Recipient wallet address
  reference: string; // Unique UUID for this payment attempt
  description: string;
  resource: string; // The original resource URL
}

export interface PaymentPayload {
  x402Version: string;
  scheme: string;
  network: string;
  signature: string; // Transaction signature (base58)
  account: string; // Payer wallet address
}

export interface SettlementResponse {
  success: boolean;
  transactionId: string;
  settledAt: string; // ISO timestamp
}