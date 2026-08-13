export type UserRole =
  | "ADMIN"
  | "TECNICO"
  | "SOLICITANTE";

export type SystemUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  success: boolean;
  total: number;
  users: SystemUser[];
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  user: SystemUser;
};

export type UpdateUserStatusInput = {
  userId: number;
  active: boolean;
};

export type UpdateUserStatusResponse = {
  success: boolean;
  message: string;
  user: SystemUser;
};