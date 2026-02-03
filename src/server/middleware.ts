import { Request, Response, NextFunction } from 'express';
import { PaymentRequirements, X402PaymentRequiredHeader } from '../types/x402';
import { verifyAndSettlePayment } from './verifier';

/**
 * Middleware to protect endpoints with X402 payments.
 * Usage: app.get('/protected', x402PaymentRequired(paymentRules), (req, res) => { ... });
 */
export function x402PaymentRequired(
  rules: {
    resource: string;
    description: string;
    accepts: PaymentRequirements['accepts'];
  }
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if the request includes a payment signature
    const paymentSigHeader = req.headers['payment-signature'] as string | undefined;

    if (!paymentSigHeader) {
      // No payment provided - challenge with 402
      const paymentReq: PaymentRequirements = {
        x402Version: '1.0.0',
        accepts: rules.accepts.map(acc => ({
          ...acc,
          reference: crypto.randomUUID(), // Unique ref per request
          resource: req.url,
          description: rules.description
        }))
      };

      const encodedReq = Buffer.from(JSON.stringify(paymentReq)).toString('base64');
      
      res.status(402).set('PAYMENT-REQUIRED', encodedReq).end();
      return;
    }

    // Payment provided - verify and settle
    try {
      const settlement = await verifyAndSettlePayment(paymentSigHeader);

      if (settlement.success) {
        // Add settlement info to response
        res.set('PAYMENT-RESPONSE', Buffer.from(JSON.stringify(settlement)).toString('base64'));
        next(); // Proceed to route handler
      } else {
        // Invalid payment - return 402 again
        res.status(402).end();
      }
    } catch (error) {
      console.error('X402 verification error:', error);
      res.status(500).end(); // Internal error during verification
    }
  };
}