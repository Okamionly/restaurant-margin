/**
 * @file api/routes/stripe.ts
 * Stripe billing module: webhook, checkout session, customer portal.
 * Extracted from api/index.ts monolith (first step of decomposition).
 *
 * Security note: webhook endpoint requires STRIPE_WEBHOOK_SECRET.
 * Any request without a valid signature is rejected with HTTP 400 (CWE-345 fix).
 */
import { Router } from 'express';
import express from 'express';
import { Resend } from 'resend';
import { prisma } from '../prisma';
import { authMiddleware, validateRequest } from '../middleware';
import { buildActivationCodeEmail } from '../utils/emailTemplates';
import { stripeCheckoutRequestSchema } from '../schemas/stripe';

const router = Router();

// ── Stripe Price IDs ───────────────────────────────────────────────────────────
// SECURITY: no hardcoded live fallbacks — previous `|| 'price_...'` meant a
// preview deploy missing an env var would silently charge against LIVE prices.
// Fail loud at module load time so missing config is caught in CI, not in prod.
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
export const STRIPE_PRICES = {
  PRO_MONTHLY: requireEnv('STRIPE_PRICE_PRO_MONTHLY'),
  PRO_ANNUAL: requireEnv('STRIPE_PRICE_PRO_ANNUAL'),
  BUSINESS_MONTHLY: requireEnv('STRIPE_PRICE_BUSINESS_MONTHLY'),
  BUSINESS_ANNUAL: requireEnv('STRIPE_PRICE_BUSINESS_ANNUAL'),
} as const;

// ── Webhook (raw body — must be mounted BEFORE express.json()) ─────────────────
// Mount with: app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler)
export async function stripeWebhookHandler(req: any, res: any) {
  try {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // SECURITY: Require STRIPE_WEBHOOK_SECRET — reject all requests if not configured.
    // Prevents forged webhook events (CWE-345). No fallback JSON.parse allowed.
    if (!endpointSecret) {
      console.error('[STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET not configured — rejecting request');
      return res.status(400).send('Webhook configuration error: missing STRIPE_WEBHOOK_SECRET');
    }
    if (!sig) {
      console.error('[STRIPE WEBHOOK] Missing stripe-signature header — rejecting request');
      return res.status(400).send('Missing stripe-signature header');
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    let event: any;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('[STRIPE WEBHOOK] Signature verification failed:', err.message);
      return res.status(400).send('Webhook signature verification failed');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const amountTotal = session.amount_total;

      let plan = session.metadata?.planType || 'pro';
      if (!session.metadata?.planType && amountTotal && amountTotal >= 7000) {
        plan = 'business';
      }

      const metaUserId = session.metadata?.userId ? parseInt(session.metadata.userId) : null;
      if (metaUserId) {
        await prisma.user.update({
          where: { id: metaUserId },
          data: {
            plan,
            stripeCustomerId: session.customer || null,
            stripeSubId: session.subscription || null,
            trialEndsAt: null,
          },
        });
        console.log(`[STRIPE WEBHOOK] User ${metaUserId} upgraded to ${plan}, stripeCustomer=${session.customer}`);
      } else if (customerEmail) {
        const user = await prisma.user.findUnique({ where: { email: customerEmail } });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan,
              stripeCustomerId: session.customer || null,
              stripeSubId: session.subscription || null,
              trialEndsAt: null,
            },
          });
          console.log(`[STRIPE WEBHOOK] User ${user.id} (by email) upgraded to ${plan}`);
        }
      }

      // Generate activation code (legacy flow)
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'RM-';
      for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
      await prisma.activationCode.create({ data: { code, plan, stripePaymentId: session.id } });

      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && customerEmail) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: customerEmail,
          subject: `RestauMargin — Votre code d'activation ${plan.toUpperCase()}`,
          html: buildActivationCodeEmail({ planName: plan === 'pro' ? 'Professionnel' : 'Business', activationCode: code }),
        });
        console.log(`[STRIPE WEBHOOK] Code ${code} (${plan}) envoyé à ${customerEmail}`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: 'basic', stripeSubId: null },
        });
        console.log(`[STRIPE WEBHOOK] Subscription cancelled for user ${user.id}, downgraded to basic`);
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
      if (user) {
        console.log(`[STRIPE WEBHOOK] Payment failed for user ${user.id} (${user.email})`);
      }
    }

    res.json({ received: true });
  } catch (e: any) {
    console.error('[STRIPE WEBHOOK ERROR]', e.message);
    res.status(400).json({ error: e.message });
  }
}

// ── Stripe Checkout Session ────────────────────────────────────────────────────
router.post('/checkout', authMiddleware, validateRequest(stripeCheckoutRequestSchema), async (req: any, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(503).json({ error: 'Stripe non configuré' });
    const stripe = require('stripe')(stripeKey);

    const { planId, annual } = req.body;
    if (!planId || !['pro', 'business'].includes(planId)) {
      return res.status(400).json({ error: 'planId invalide (pro ou business)' });
    }

    let priceId: string;
    if (planId === 'pro') {
      priceId = annual ? STRIPE_PRICES.PRO_ANNUAL : STRIPE_PRICES.PRO_MONTHLY;
    } else {
      priceId = annual ? STRIPE_PRICES.BUSINESS_ANNUAL : STRIPE_PRICES.BUSINESS_MONTHLY;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const membership = await prisma.restaurantMember.findFirst({
      where: { userId: user.id },
      select: { restaurantId: true },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: 'https://www.restaumargin.fr/dashboard?subscription=success',
      cancel_url: 'https://www.restaumargin.fr/abonnement',
      metadata: {
        userId: String(user.id),
        restaurantId: membership ? String(membership.restaurantId) : '',
        planType: planId,
      },
      subscription_data: {
        metadata: { userId: String(user.id), planType: planId },
      },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('[STRIPE CHECKOUT ERROR]', err.message);
    res.status(500).json({ error: 'Erreur création session Stripe', details: err.message });
  }
});

// ── Stripe Customer Portal ─────────────────────────────────────────────────────
router.post('/portal', authMiddleware, async (req: any, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(503).json({ error: 'Stripe non configuré' });
    const stripe = require('stripe')(stripeKey);

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({ email: user.email, name: user.name || undefined });
      customerId = customer.id;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://www.restaumargin.fr/abonnement',
    });

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur création portail Stripe', details: err.message });
  }
});

export default router;
