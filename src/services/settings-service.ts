import { api } from "./api";

import type {
  SettingsResponse,
  UpdateSettingsInput,
  UpdateSettingsResponse,
} from "../types/settings";

export async function getSettings() {
  const response =
    await api.get<SettingsResponse>("/settings");

  return response.data.settings;
}

export async function updateSettings(
  data: UpdateSettingsInput,
) {
  const response =
    await api.patch<UpdateSettingsResponse>(
      "/settings",
      data,
    );

  return response.data;
}

export async function testSmtpConnection() {
  const response = await api.post<{
    success: boolean;
    message: string;
    smtp?: {
      host: string;
      port: number;
      user: string;
    };
  }>("/settings/test-smtp");

  return response.data;
}

export async function sendTestEmail(
  to: string,
) {
  const response = await api.post<{
    success: boolean;
    message: string;
    email: {
      to: string;
    };
  }>("/settings/test-email", {
    to,
  });

  return response.data;
}