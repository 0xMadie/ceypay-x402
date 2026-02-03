// Demo script for CeyPay x402
// Simulates the core flow: Agent requests -> Gets 402 -> Pays -> Gets resource

import { X402AgentClient } from './src/client/agent';
import { Keypair } from '@solana/web3.js';

async function runDemo() {
  console.log('🚀 Starting CeyPay x402 Demo...\n');

  // Simulate an agent with a wallet
  const agentWallet = Keypair.generate();
  const agent = new X402AgentClient(agentWallet);

  console.log('🤖 Agent initialized with wallet:', agentWallet.publicKey.toBase58());
  console.log('💳 Attempting to access premium resource...\n');

  try {
    // This would normally fail with 402 and then retry with payment
    // For demo, we'll simulate the flow
    console.log('🔒 Request sent to server...');
    console.log('💰 Server responded with 402 Payment Required.');
    console.log('📋 Payment requirements received (encoded in PAYMENT-REQUIRED header)');
    console.log('💸 Agent constructs Solana Pay transaction...');
    console.log('✅ Transaction signed and sent to blockchain (simulated)...');
    console.log('🔄 Agent retries original request with PAYMENT-SIGNATURE header...');
    console.log('🔓 Server verified payment and returned requested resource!\n');
    
    console.log('✅ CeyPay x402 flow completed successfully!');
    console.log('🎯 AI agents can now autonomously pay for services over HTTP using Solana.');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

runDemo();