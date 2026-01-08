
import { User, Store, Rating, UserRole, DashboardStats } from '../types';

/**
 * ApiService
 * In a real-world scenario, these methods would perform `fetch` calls 
 * to a Node.js/Express server which queries a MySQL database.
 * For this environment, we persist data to localStorage to simulate a database.
 */

const STORAGE_KEYS = {
  USERS: 'sr_users',
  STORES: 'sr_stores',
  RATINGS: 'sr_ratings',
  CURRENT_USER: 'sr_current_user'
};

const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Master System Administrator Account 01',
    email: 'admin@example.com',
    password: 'AdminPassword1!',
    address: '123 Admin St, Tech City, 54321',
    role: UserRole.ADMIN
  },
  {
    id: 'u-2',
    name: 'Johnathan Doe Registered User Account 02',
    email: 'user@example.com',
    password: 'UserPassword1!',
    address: '456 User Ave, Consumer Town, 12345',
    role: UserRole.USER
  },
  {
    id: 'u-3',
    name: 'Sarah Smith Store Owner Business Owner',
    email: 'owner@example.com',
    password: 'OwnerPassword1!',
    address: '789 Business Rd, Enterprise Hub, 67890',
    role: UserRole.OWNER
  },
  {
    id: 'u-4',
    name: 'Michael Chen Global Retailer Proprietor',
    email: 'michael@owner.com',
    password: 'OwnerPassword2!',
    address: '321 Commerce Way, Trade District, 11223',
    role: UserRole.OWNER
  }
];

const INITIAL_STORES: Store[] = [
  {
    id: 's-1',
    ownerId: 'u-3',
    name: 'The Tech Emporium Superstore Premium',
    email: 'tech@emporium.com',
    address: '101 Silicon Valley Blvd, CA 94000',
    description: 'Premier destination for high-end hardware and gadgets.'
  },
  {
    id: 's-2',
    ownerId: 'u-4',
    name: 'Gourmet Delights & Fine Groceries',
    email: 'info@gourmetdelights.com',
    address: '45 Artisan Lane, Foodie District, NY 10001',
    description: 'Organic produce, imported cheeses, and artisan breads.'
  },
  {
    id: 's-3',
    ownerId: 'u-3',
    name: 'Urban Fashion Hub - Downtown',
    email: 'contact@urbanfashion.com',
    address: '77 Trendy Ave, Metropolitan Area, IL 60601',
    description: 'Latest styles in streetwear and high-end fashion.'
  },
  {
    id: 's-4',
    ownerId: 'u-4',
    name: 'Eco-Living & Sustainable Home',
    email: 'hello@ecoliving.com',
    address: '12 Green Way, Eco Village, WA 98101',
    description: 'Everything you need for a zero-waste and sustainable lifestyle.'
  }
];

const INITIAL_RATINGS: Rating[] = [
  {
    id: 'r-1',
    userId: 'u-2',
    storeId: 's-1',
    score: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'r-2',
    userId: 'u-2',
    storeId: 's-2',
    score: 4,
    createdAt: new Date().toISOString()
  }
];

// Initialize "Database"
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(INITIAL_STORES));
  localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(INITIAL_RATINGS));
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication Actions
  async login(email: string, password: string): Promise<User> {
    await delay(800);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials. Check your email and password.');
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  async signup(data: Omit<User, 'id'>): Promise<User> {
    await delay(1000);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.some(u => u.email === data.email)) throw new Error('A user with this email already exists.');
    
    const newUser = { ...data, id: 'u-' + Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  async updatePassword(userId: string, newPass: string): Promise<void> {
    await delay(600);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User context lost. Please log in again.');
    users[index].password = newPass;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '{}');
    if (current.id === userId) {
      current.password = newPass;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  // System Administration Actions
  async getDashboardStats(): Promise<DashboardStats> {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const stores = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORES) || '[]');
    const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '[]');
    return {
      totalUsers: users.length,
      totalStores: stores.length,
      totalRatings: ratings.length
    };
  },

  async getAllUsers(): Promise<User[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  async addUser(data: User): Promise<void> {
    const users = await this.getAllUsers();
    users.push(data);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  async getAllStores(): Promise<Store[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STORES) || '[]');
  },

  async addStore(data: Store): Promise<void> {
    const stores = await this.getAllStores();
    stores.push(data);
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  },

  // Ratings Engine
  async getRatingsForStore(storeId: string): Promise<Rating[]> {
    const ratings: Rating[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '[]');
    return ratings.filter(r => r.storeId === storeId);
  },

  async submitRating(userId: string, storeId: string, score: number): Promise<void> {
    const ratings: Rating[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '[]');
    const existingIndex = ratings.findIndex(r => r.userId === userId && r.storeId === storeId);
    
    if (existingIndex !== -1) {
      ratings[existingIndex].score = score;
      ratings[existingIndex].createdAt = new Date().toISOString();
    } else {
      ratings.push({
        id: 'r-' + Math.random().toString(36).substr(2, 9),
        userId,
        storeId,
        score,
        createdAt: new Date().toISOString()
      });
    }
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
  },

  async getAverageRating(storeId: string): Promise<number> {
    const storeRatings = await this.getRatingsForStore(storeId);
    if (storeRatings.length === 0) return 0;
    const sum = storeRatings.reduce((acc, r) => acc + r.score, 0);
    return sum / storeRatings.length;
  }
};
