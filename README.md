# CeyPay x402

An internet-native payment protocol for AI agents on Solana. Implements the HTTP 402 Payment Required standard to enable autonomous, machine-to-machine commerce using Solana Pay.

## Overview

This project implements the x402 protocol specifically for Solana, allowing AI agents to autonomously pay for services and resources over HTTP. By leveraging Solana's speed and low fees, we enable true "pay-per-use" models for APIs and digital services.

## Features

- **HTTP 402 Compliance:** Uses the standard `PAYMENT-REQUIRED` and `PAYMENT-SIGNATURE` headers.
- **Solana Integration:** Leverages Solana Pay transaction requests and SPL tokens.
- **Agentic Payments:** Designed for AI agents to handle payments autonomously.
- **Real-time Settlement:** Sub-second finality via Solana's blockchain.

## Architecture

- `src/types/x402.ts`: Core protocol types and interfaces.
- `src/server/middleware.ts`: Express middleware to protect endpoints with x402.
- `src/server/verifier.ts`: Logic to verify and settle payments on Solana.
- `src/client/agent.ts`: Client library for AI agents to handle x402 challenges.

## Getting Started

1. Install dependencies: `npm install`
2. Set environment variables:
   - `SOLANA_RPC_URL`: Solana RPC endpoint
3. Run tests: `npm test`

## Usage

### Server Side (Protecting an endpoint)

```typescript
import express from 'express';
import { x402PaymentRequired } from './src/server/middleware';

const app = express();

app.get('/premium-data', x402PaymentRequired({
  resource: '/premium-data',
  description: 'Access to premium market data',
  accepts: [{
    scheme: 'exact',
    network: 'solana:101',
    asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    amount: '1000000', // 1.00 USDC
    payTo: 'CeyPayMerchantAddress...',
  }]
}), (req, res) => {
  // This runs only after successful payment
  res.json({ data: 'Premium content' });
});
```

### Client Side (AI Agent)

```typescript
import { X402AgentClient } from './src/client/agent';
import { Keypair } from '@solana/web3.js';

const agent = new X402AgentClient(Keypair.generate());

try {
  const data = await agent.request('https://api.ceypay.io/premium-data');
  console.log(data); // { data: 'Premium content' }
} catch (error) {
  console.error('Payment failed:', error);
}
```

## Hackathon Status

- **Draft:** This project is currently in draft status for the Colosseum Agent Hackathon.
- **Repo:** https://github.com/ceyloncash/ceypay-x402
- **Tags:** payments, ai, infra