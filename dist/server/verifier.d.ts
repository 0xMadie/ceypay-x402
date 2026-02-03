import { SettlementResponse } from '../types/x402';
/**
 * Verifies a payment signature against the original request.
 * This function connects to the Solana blockchain to validate the transaction.
 */
export declare function verifyAndSettlePayment(encodedPayload: string): Promise<SettlementResponse>;
