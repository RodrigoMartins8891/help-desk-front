import { api } from "./api";

export type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  userId: number;
  ticketId: number | null;
  createdAt: string;
  updatedAt: string;

  ticket: {
    id: number;
    protocol: string;
    title: string;
  } | null;
};

type NotificationsResponse = {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
};

export async function getNotifications() {
  const response =
    await api.get<NotificationsResponse>(
      "/notifications",
    );

  return response.data;
}

export async function markNotificationAsRead(
  notificationId: number,
) {
  const response = await api.patch(
    `/notifications/${notificationId}/read`,
  );

  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch(
    "/notifications/read-all",
  );

  return response.data;
}