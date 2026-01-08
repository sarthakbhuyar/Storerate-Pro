
export enum UserRole {
  ADMIN = 'System Administrator',
  USER = 'Normal User',
  OWNER = 'Store Owner'
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  password?: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  address: string;
  description?: string;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  score: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface StoreWithRating extends Store {
  averageRating: number;
  totalRatings: number;
  userRating?: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}
