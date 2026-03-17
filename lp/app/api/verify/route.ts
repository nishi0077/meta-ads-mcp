import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function POST(request: NextRequest) {
  try {
    const { license_key } = await request.json();

    if (!license_key || typeof license_key !== "string") {
      return NextResponse.json(
        { valid: false, error: "License key is required" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    const subscriptions = await stripe.subscriptions.search({
      query: `metadata["license_key"]:"${license_key}"`,
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const sub = subscriptions.data[0];
      if (sub.status === "active" || sub.status === "trialing") {
        return NextResponse.json({
          valid: true,
          plan: sub.metadata.plan || "subscription",
          expires_at: new Date(
            sub.current_period_end * 1000
          ).toISOString(),
        });
      }
      return NextResponse.json(
        {
          valid: false,
          error: `Subscription is ${sub.status}. Renew at ${process.env.NEXT_PUBLIC_URL}`,
        },
        { status: 403 }
      );
    }

    const customers = await stripe.customers.search({
      query: `metadata["license_key"]:"${license_key}"`,
      limit: 1,
    });

    if (customers.data.length > 0) {
      const customer = customers.data[0];
      if (customer.metadata.plan === "lifetime") {
        return NextResponse.json({
          valid: true,
          plan: "lifetime",
          expires_at: null,
        });
      }
    }

    return NextResponse.json(
      { valid: false, error: "Invalid license key" },
      { status: 403 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Verification failed";
    console.error("License verification error:", message);
    return NextResponse.json(
      { valid: false, error: "Verification service error" },
      { status: 500 }
    );
  }
}
