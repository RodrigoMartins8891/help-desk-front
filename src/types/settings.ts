export type ThemeMode = "light" | "dark" | "system";

export type SystemSettings = {
  id: number;

  companyName: string;
  systemName: string;
  logoUrl: string | null;

  theme: ThemeMode;
  primaryColor: string;
  language: string;
  timezone: string;

  lowFirstResponseMinutes: number;
  lowResolutionMinutes: number;

  mediumFirstResponseMinutes: number;
  mediumResolutionMinutes: number;

  highFirstResponseMinutes: number;
  highResolutionMinutes: number;

  criticalFirstResponseMinutes: number;
  criticalResolutionMinutes: number;

  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpFrom: string | null;

  smtpPasswordConfigured: boolean;

  openAiModel: string;
  openAiConfigured: boolean;

  webhookUrl: string | null;

  createdAt: string;
  updatedAt: string;
};

export type UpdateSettingsInput = {
  companyName?: string;
  systemName?: string;
  logoUrl?: string | null;

  theme?: ThemeMode;
  primaryColor?: string;
  language?: string;
  timezone?: string;

  lowFirstResponseMinutes?: number;
  lowResolutionMinutes?: number;

  mediumFirstResponseMinutes?: number;
  mediumResolutionMinutes?: number;

  highFirstResponseMinutes?: number;
  highResolutionMinutes?: number;

  criticalFirstResponseMinutes?: number;
  criticalResolutionMinutes?: number;

  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpUser?: string | null;
  smtpPassword?: string | null;
  smtpFrom?: string | null;

  openAiKey?: string | null;
  openAiModel?: string;

  webhookUrl?: string | null;
};

export type SettingsResponse = {
  success: boolean;
  settings: SystemSettings;
};

export type UpdateSettingsResponse = {
  success: boolean;
  message: string;
  settings: SystemSettings;
};