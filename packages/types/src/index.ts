export enum ContentType {
  MOVIE = 'movie',
  TV_SHOW = 'tv_show',
  SPORTS = 'sports',
}

export enum WorkflowState {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
}

export interface User {
  id: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  maturityRating: string;
  languagePreference: string;
  createdAt: Date;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  releaseDate?: Date;
  durationMinutes?: number;
  maturityRating?: string;
  posterUrl?: string;
  thumbnailUrl?: string;
  trailerUrl?: string;
  workflowState: WorkflowState;
  tierRequirement: SubscriptionTier;
  geoRestriction: string;
  availableFrom?: Date;
  availableUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  subscriptionTier: SubscriptionTier;
}
