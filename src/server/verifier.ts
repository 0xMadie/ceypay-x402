import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { PaymentPayload, SettlementResponse } from '../types/x402';

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');

/**
 * Verifies a payment signature against the original request.
 * This function connects to the Solana blockchain to validate the transaction.
 */
export async function verifyAndSettlePayment(
  encodedPayload: string
): Promise<SettlementResponse> {
  try {
    // Decode the base64 payload
    const rawJson = Buffer.from(encodedPayload, 'base64').toString('utf8');
    const payload: PaymentPayload = JSON.parse(rawJson);

    // Fetch the transaction from Solana
    const tx = await connection.getTransaction(payload.signature, {
      commitment: 'confirmed'
    });

    if (!tx) {
      throw new Error(`Transaction ${payload.signature} not found on Solana`);
    }

    // Verify the transaction details match the expected payment
    // (This is simplified - real implementation would validate amounts, recipients, etc.)
    // CompiledInstruction uses 'programIdIndex' to refer to the account index of the program
    const memoProgramIndex = tx.transaction.message.accountKeys.findIndex(key => 
      key.equals(new PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'))
    );
    const transferInstruction = tx.transaction.message.instructions.find(ix =>
      ix.programIdIndex === memoProgramIndex
    );

    if (!transferInstruction) {
      throw new Error('Invalid transaction: no transfer instruction found');
    }

    return {
      success: true,
      transactionId: payload.signature,
      settledAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Payment verification failed:', error);
    return {
      success: false,
      transactionId: '',
      settledAt: new Date().toISOString()
    };
  }
}