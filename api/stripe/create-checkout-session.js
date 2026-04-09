const { z } = require("zod");
const Stripe = require("stripe");
const { ensureUserId } = require("../../lib/session/userCookie");
const { sendJson, readJsonBody } = require("../../lib/api/utils");

const checkoutSchema = z.object({
  session_id: z.string().min(1),
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const userId = ensureUserId(req, res);
  let payload;

  try {
    payload = checkoutSchema.parse(await readJsonBody(req));
  } catch (error) {
    return sendJson(res, 400, { error: "Invalid payload" });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!stripeSecret || !priceId || !appUrl) {
    return sendJson(res, 500, { error: "Missing Stripe configuration" });
  }

  try {
    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        user_id: userId,
        onboarding_session_id: payload.session_id,
      },
    });

    return sendJson(res, 200, { url: session.url });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to create checkout session" });
  }
};
