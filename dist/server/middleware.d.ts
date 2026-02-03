import { Request, Response, NextFunction } from 'express';
import { PaymentRequirements } from '../types/x402';
/**
 * Middleware to protect endpoints with X402 payments.
 * Usage: app.get('/protected', x402PaymentRequired(paymentRules), (req, res) => { ... });
 */
export declare function x402PaymentRequired(rules: {
    resource: string;
    description: string;
    accepts: PaymentRequirements['accepts'];
}): (req: Request, res: Response, next: NextFunction) => Promise<void>;
