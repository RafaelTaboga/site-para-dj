import type { User, DjProfile, Subscription, Proposal, AiConfig, SocialLink, MediaItem } from "@prisma/client";

export type UserWithRelations = User & {
  profile: DjProfile | null;
  subscription: Subscription | null;
  socialLinks: SocialLink[];
  mediaItems: MediaItem[];
  aiConfig: AiConfig | null;
};

export type ProposalWithUser = Proposal & {
  user: User & { profile: DjProfile | null };
};

export type PublicDjData = User & {
  profile: DjProfile;
  socialLinks: SocialLink[];
  mediaItems: MediaItem[];
};

export type SubscriptionInfo = {
  status: string;
  trialDays: number;
  isActive: boolean;
  currentPeriodEnd?: Date;
};
