import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, STRIPE_PRICE_ID, APP_URL } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  // Reuse Stripe customer if exists
  let customerId = user.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${APP_URL}/dashboard/billing?canceled=true`,
    metadata: { userId: user.id },
    payment_method_types: ["card"],
    locale: "pt-BR",
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
