import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const getUserId = (obj: any): string | null =>
    obj?.metadata?.userId ?? null;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = getUserId(session);
      if (!userId || !session.subscription) break;

      const sub = await stripe.subscriptions.retrieve(session.subscription as string);

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: "ACTIVE",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          stripePriceId: sub.items.data[0]?.price.id,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });

      await prisma.djProfile.update({
        where: { userId },
        data: { isPublished: true },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const userId = getUserId(sub);
      if (!userId) break;

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: "ACTIVE",
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const userId = getUserId(sub);
      if (!userId) break;
      await prisma.subscription.update({
        where: { userId },
        data: { status: "PAST_DUE" },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = getUserId(sub);
      if (!userId) break;
      await prisma.subscription.update({
        where: { userId },
        data: { status: "CANCELED", canceledAt: new Date() },
      });
      await prisma.djProfile.update({
        where: { userId },
        data: { isPublished: false },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
