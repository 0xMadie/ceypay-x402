import { AxiosRequestConfig } from 'axios';
import { Keypair } from '@solana/web3.js';
/**
 * X402 Client for AI Agents
 * Handles the 402 challenge/response cycle automatically.
 */
export declare class X402AgentClient {
    private payer;
    constructor(payer: Keypair);
    /**
     * Makes a request to a protected resource, automatically handling payment if required.
     */
    request<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
