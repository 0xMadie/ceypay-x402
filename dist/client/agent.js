"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.X402AgentClient = void 0;
const axios_1 = __importDefault(require("axios"));
const web3_js_1 = require("@solana/web3.js");
/**
 * X402 Client for AI Agents
 * Handles the 402 challenge/response cycle automatically.
 */
class X402AgentClient {
    constructor(payer) {
        this.payer = payer;
    }
    /**
     * Makes a request to a protected resource, automatically handling payment if required.
     */
    async request(url, config) {
        // Initial request
        try {
            const response = await axios_1.default.get(url, config);
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 402) {
                // Got 402 - need to pay
                const paymentRequiredHeader = error.response.headers['payment-required'];
                if (!paymentRequiredHeader) {
                    throw new Error('402 response missing PAYMENT-REQUIRED header');
                }
                // Decode payment requirements
                const rawJson = Buffer.from(paymentRequiredHeader, 'base64').toString('utf8');
                const requirements = JSON.parse(rawJson);
                // Select first available payment option (simplified)
                const option = requirements.accepts[0];
                if (!option) {
                    throw new Error('No payment options available');
                }
                // Create Solana Pay transaction (simplified)
                // In a real impl, this would use @solana/pay to construct the TX
                const transaction = new web3_js_1.Transaction().add(
                // Placeholder for SPL Token transfer
                // This is where we'd integrate with Solana Pay's transaction construction
                {
                    programId: new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program
                    keys: [],
                    data: Buffer.from([]) // Actual transfer data would go here
                });
                // Sign and send transaction
                // In a real impl, this would connect to an RPC
                // Placeholder for now - we'll simulate a signature
                const signature = 'simulated_signature_for_demo';
                // const signature = await sendAndConfirmTransaction(
                //   connection, // Real connection to Solana RPC
                //   transaction, 
                //   [this.payer]
                // );
                // Construct payment payload
                const payload = {
                    x402Version: '1.0.0',
                    scheme: option.scheme,
                    network: option.network,
                    signature: signature,
                    account: this.payer.publicKey.toBase58(),
                };
                // Retry original request with payment
                const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
                const retryConfig = {
                    ...config,
                    headers: {
                        ...config?.headers,
                        'PAYMENT-SIGNATURE': encodedPayload
                    }
                };
                const retryResponse = await axios_1.default.get(url, retryConfig);
                return retryResponse.data;
            }
            // Non-402 error - re-throw
            throw error;
        }
    }
}
exports.X402AgentClient = X402AgentClient;
//# sourceMappingURL=agent.js.map