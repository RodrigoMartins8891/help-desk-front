import { api } from "./api";

import type {
  CreateUserInput,
  CreateUserResponse,
  UpdateUserStatusInput,
  UpdateUserStatusResponse,
  UsersResponse,
} from "../types/user";

export async function getUsers() {
  const response =
    await api.get<UsersResponse>("/users");

  return response.data;
}

export async function createUser(
  data: CreateUserInput,
) {
  const response =
    await api.post<CreateUserResponse>(
      "/users",
      data,
    );

  return response.data;
}

export async function updateUserStatus({
  userId,
  active,
}: UpdateUserStatusInput) {
  const response =
    await api.patch<UpdateUserStatusResponse>(
      `/users/${userId}/status`,
      {
        active,
      },
    );

  return response.data;
}