import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  if (!isDashboard) return NextResponse.next();

  if (!req.auth?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isBillingPage = req.nextUrl.pathname === "/dashboard/billing";
  if (isBillingPage) return NextResponse.next();

  const { prisma } = await import("@/lib/prisma");
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.auth.user.id },
  });

  if (!subscription) {
    return NextResponse.redirect(new URL("/dashboard/billing", req.url));
  }

  const isTrialing =
    subscription.status === "TRIALING" &&
    new Date() < subscription.trialEndsAt;

  const isActive = subscription.status === "ACTIVE";

  const isPastDueGrace =
    subscription.status === "PAST_DUE" &&
    subscription.currentPeriodEnd &&
    new Date() < new Date(new Date(subscription.currentPeriodEnd).getTime() + 3 * 24 * 60 * 60 * 1000);

  if (!isTrialing && !isActive && !isPastDueGrace) {
    return NextResponse.redirect(new URL("/dashboard/billing", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
