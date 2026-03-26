import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

interface PlanConfig {
  stripePriceEnv: string;
  mode: "subscription" | "payment";
  trialDays?: number;
}

const planConfigs: Record<string, PlanConfig> = {
  monthly: {
    stripePriceEnv: "STRIPE_PRICE_MONTHLY",
    mode: "subscription",
    trialDays: 7,
  },
  yearly: {
    stripePriceEnv: "STRIPE_PRICE_YEARLY",
    mode: "subscription",
    trialDays: 7,
  },
  lifetime: {
    stripePriceEnv: "STRIPE_PRICE_LIFETIME",
    mode: "payment",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { priceId, githubUsername } = await request.json();

    const config = planConfigs[priceId];
    if (!config) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const stripePriceId = process.env[config.stripePriceEnv];
    if (!stripePriceId) {
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 500 }
      );
    }

    if (!githubUsername || typeof githubUsername !== "string") {
      return NextResponse.json(
        { error: "GitHub username is required" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const metadata = {
      github_username: githubUsername,
      plan: priceId,
    };

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: config.mode,
      payment_method_types: ["card"],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      metadata,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
    };

    if (config.mode === "subscription") {
      sessionParams.subscription_data = {
        metadata,
        ...(config.trialDays ? { trial_period_days: config.trialDays } : {}),
      };
    }

    if (config.mode === "payment") {
      sessionParams.payment_intent_data = { metadata };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
