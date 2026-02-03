"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x402PaymentRequired = x402PaymentRequired;
const verifier_1 = require("./verifier");
/**
 * Middleware to protect endpoints with X402 payments.
 * Usage: app.get('/protected', x402PaymentRequired(paymentRules), (req, res) => { ... });
 */
function x402PaymentRequired(rules) {
    return async (req, res, next) => {
        // Check if the request includes a payment signature
        const paymentSigHeader = req.headers['payment-signature'];
        if (!paymentSigHeader) {
            // No payment provided - challenge with 402
            const paymentReq = {
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
            const settlement = await (0, verifier_1.verifyAndSettlePayment)(paymentSigHeader);
            if (settlement.success) {
                // Add settlement info to response
                res.set('PAYMENT-RESPONSE', Buffer.from(JSON.stringify(settlement)).toString('base64'));
                next(); // Proceed to route handler
            }
            else {
                // Invalid payment - return 402 again
                res.status(402).end();
            }
        }
        catch (error) {
            console.error('X402 verification error:', error);
            res.status(500).end(); // Internal error during verification
        }
    };
}
//# sourceMappingURL=middleware.js.map