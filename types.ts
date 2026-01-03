export interface TwinAttributes {
  ageRange: string;
  ethnicity: string;
  gender: string;
  hairStyle: string;
  distinctiveFeatures: string[];
}

export interface Twin {
  id: string;
  name: string;
  imageUrl: string;
  pricePerUse: number;
  royaltyRate: number; // percentage
  genres: string[];
  attributes: TwinAttributes;
  bio: string;
  totalEarnings: number;
  rating: number;
  isVerified: boolean;
}

export interface User {
  id: string;
  name: string;
  balance: number;
  ownedTwins: Twin[];
}

export type ViewState = 'home' | 'marketplace' | 'dashboard' | 'upload';
