export type UserRole = "ADMIN" | "TECNICO" | "SOLICITANTE";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};