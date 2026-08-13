import {
  Bell,
  CheckCheck,
  LogOut,
  UserCircle,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../hooks/useNotifications";

export function Header() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  const notificationsQuery =
    useNotifications();

  const markAsReadMutation =
    useMarkNotificationAsRead();

  const markAllMutation =
    useMarkAllNotificationsAsRead();

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  const notificationsRef =
    useRef<HTMLDivElement | null>(null);

  const notifications =
    notificationsQuery.data?.notifications ?? [];

  const unreadCount =
    notificationsQuery.data?.unreadCount ?? 0;

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  async function handleNotificationClick(
    notificationId: number,
    ticketId: number | null,
    isRead: boolean,
  ) {
    if (!isRead) {
      try {
        await markAsReadMutation.mutateAsync(
          notificationId,
        );
      } catch (error) {
        console.error(
          "Erro ao marcar notificação como lida:",
          error,
        );
      }
    }

    setIsNotificationsOpen(false);

    if (ticketId) {
      navigate(`/tickets/${ticketId}`);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllMutation.mutateAsync();
    } catch (error) {
      console.error(
        "Erro ao marcar notificações como lidas:",
        error,
      );
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Central de atendimento
        </p>

        <h1 className="text-xl font-bold text-slate-900">
          Painel Help Desk
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div
          ref={notificationsRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setIsNotificationsOpen(
                (current) => !current,
              )
            }
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-14 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Notificações
                  </h2>

                  <p className="text-xs text-slate-500">
                    {unreadCount} não lida
                    {unreadCount === 1
                      ? ""
                      : "s"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    disabled={
                      markAllMutation.isPending
                    }
                    className="text-primary inline-flex items-center gap-1 text-xs font-semibold disabled:opacity-50"
                  >
                    <CheckCheck size={15} />

                    Marcar todas
                  </button>
                )}
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {notificationsQuery.isLoading ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Carregando notificações...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Nenhuma notificação
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Novas atualizações aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification.id,
                            notification.ticketId,
                            notification.read,
                          )
                        }
                        className={[
                          "block w-full border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50",
                          notification.read
                            ? "bg-white"
                            : "bg-blue-50/60",
                        ].join(" ")}
                      >
                        <div className="flex gap-3">
                          <div
                            className={[
                              "mt-2 h-2.5 w-2.5 shrink-0 rounded-full",
                              notification.read
                                ? "bg-slate-300"
                                : "bg-primary",
                            ].join(" ")}
                          />

                          <div className="min-w-0 flex-1">
                            <p
                              className={[
                                "text-sm text-slate-900",
                                notification.read
                                  ? "font-medium"
                                  : "font-bold",
                              ].join(" ")}
                            >
                              {notification.title}
                            </p>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                              {notification.message}
                            </p>

                            {notification.ticket && (
                              <p className="text-primary mt-2 text-xs font-semibold">
                                {
                                  notification
                                    .ticket
                                    .protocol
                                }
                              </p>
                            )}

                            <p className="mt-2 text-[11px] text-slate-400">
                              {new Intl.DateTimeFormat(
                                "pt-BR",
                                {
                                  dateStyle:
                                    "short",
                                  timeStyle:
                                    "short",
                                },
                              ).format(
                                new Date(
                                  notification.createdAt,
                                ),
                              )}
                            </p>
                          </div>
                        </div>
                      </button>
                    ),
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 sm:flex">
          <UserCircle
            className="text-primary"
            size={28}
          />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {user?.name}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={signOut}
          title="Sair"
          className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}