const Stripe = require("stripe");
const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson, readRawBody } = require("../../lib/api/utils");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return sendJson(res, 500, { error: "Missing Stripe configuration" });
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: "2023-10-16",
  });

  let event;

  try {
    const rawBody = await readRawBody(req);
    const signatureHeader = req.headers["stripe-signature"];
    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return sendJson(res, 400, { error: "Webhook signature verification failed" });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id || session.client_reference_id;

      if (userId) {
        const supabase = getServerSupabase();

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            status: "active",
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            stripe_session_id: session.id,
          },
          { onConflict: "user_id" }
        );

        const { error: eventError } = await supabase.from("checkout_events").insert({
          user_id: userId,
          stripe_event_id: event.id,
          stripe_event_type: event.type,
          payload_json: session,
        });

        if (eventError && eventError.code !== "42P01") {
          throw eventError;
        }
      }
    }

    return sendJson(res, 200, { received: true });
  } catch (error) {
    return sendJson(res, 500, { error: "Webhook handling failed" });
  }
};
