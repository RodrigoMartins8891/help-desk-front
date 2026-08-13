import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";
import { socket } from "../services/socket";

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => void;
};

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_KEY = "@helpdesk:token";
const USER_KEY = "@helpdesk:user";

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const storedToken =
      localStorage.getItem(TOKEN_KEY);

    const storedUser =
      localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedUser =
          JSON.parse(storedUser) as AuthUser;

        setUser(parsedUser);

        socket.connect();

        socket.emit(
          "join-user",
          parsedUser.id,
        );
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  async function signIn(
    credentials: LoginRequest,
  ) {
    const response =
      await api.post<LoginResponse>(
        "/auth/login",
        credentials,
      );

    localStorage.setItem(
      TOKEN_KEY,
      response.data.token,
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(response.data.user),
    );

    setUser(response.data.user);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit(
      "join-user",
      response.data.user.id,
    );
  }

  function signOut() {
    if (user && socket.connected) {
      socket.emit(
        "leave-user",
        user.id,
      );
    }

    socket.disconnect();

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro do AuthProvider.",
    );
  }

  return context;
}