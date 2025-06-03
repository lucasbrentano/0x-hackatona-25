export type RouteParams = {
  '/': undefined;
  '/welcome': undefined;
  '/login': undefined;
  '/register': undefined;
  '/recover-password': undefined;
  '/create-new-password': undefined;
  '/privacy-policy': { policyText: string; lastUpdated: string };
  '/home': undefined;
  '/draw-cards': undefined;
  '/drawing': undefined;
  '/reveal-cards': undefined;
};

export type RoutesProps = {
  userToken: string | null;
};

export type SignInData = {
  token: string;
  refreshToken: string;
  expiresIn: number; // ms
  isAdmin: boolean;
  userID: string;
};

export type AuthContextData = {
  user?: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAdmin: boolean;
  isLoading: boolean; // Adicionado para controle de loading
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuthToken: () => Promise<void>; // Adicionado para refresh de token
};

export interface User {
  userID: string;
  name: string;
  nickname: string;
  email: string;
  bio: string;
  isAdmin: boolean;
  offenderDay: number;
  dataLastActive: string;
  active: boolean;
  coins: number;
}

export interface WeeklyProgressResponse {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  offenderDays: number;
}

// Tipos adicionais para melhor tipagem na web
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  token: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}