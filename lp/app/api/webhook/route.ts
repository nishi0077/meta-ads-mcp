import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

function generateLicenseKey(): string {
  const segments = Array.from({ length: 4 }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
  return `MMCP-${segments.join("-")}`;
}

async function inviteToGitHub(username: string) {
  const owner = process.env.GITHUB_REPO_OWNER!;
  const repo = process.env.GITHUB_REPO_NAME!;
  const token = process.env.GITHUB_TOKEN!;

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ permission: "pull" }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub invite failed (${res.status}): ${body}`);
  }
}

async function removeFromGitHub(username: string) {
  const owner = process.env.GITHUB_REPO_OWNER!;
  const repo = process.env.GITHUB_REPO_NAME!;
  const token = process.env.GITHUB_TOKEN!;

  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const githubUsername = session.metadata?.github_username;
      const plan = session.metadata?.plan;
      const licenseKey = generateLicenseKey();

      if (githubUsername) {
        try {
          await inviteToGitHub(githubUsername);
          console.log(`Invited ${githubUsername} to repository`);
        } catch (err) {
          console.error("GitHub invite error:", err);
        }
      }

      if (session.mode === "subscription" && session.subscription) {
        try {
          await stripe.subscriptions.update(session.subscription as string, {
            metadata: {
              license_key: licenseKey,
              github_username: githubUsername || "",
              plan: plan || "",
            },
          });
          console.log(`License key saved to subscription: ${licenseKey}`);
        } catch (err) {
          console.error("Subscription metadata save error:", err);
        }
      }

      if (session.mode === "payment") {
        try {
          if (session.customer) {
            await stripe.customers.update(session.customer as string, {
              metadata: {
                license_key: licenseKey,
                github_username: githubUsername || "",
                plan: "lifetime",
              },
            });
          }
          console.log(`Lifetime license key saved: ${licenseKey}`);
        } catch (err) {
          console.error("Customer metadata save error:", err);
        }
      }

      console.log(
        `Checkout complete: plan=${plan}, github=${githubUsername}, license=${licenseKey}`
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const githubUsername = subscription.metadata?.github_username;

      if (githubUsername) {
        try {
          await removeFromGitHub(githubUsername);
          console.log(`Removed ${githubUsername} from repository`);
        } catch (err) {
          console.error("GitHub remove error:", err);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
