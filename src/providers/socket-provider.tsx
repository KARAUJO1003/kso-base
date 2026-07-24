"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { parseCookies } from "nookies";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

import { getFirstCookieValue, sessionCookieNames } from "@/config/session-config";
import { siteConfig } from "@/config/site-config";
import { isEnabled } from "@/lib/feature-flags/feature-flag";

import { getSocketConnectionErrorMessage } from "./socket-error";

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
};

const SOCKET_CONNECTION_ERROR_TOAST_ID = "socket-connect-error";

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
});

/**
 * Conecta via socket.io só quando FEATURE_FLAGS.websocket.enabled=true E
 * NEXT_PUBLIC_WEBSOCKET_URL estiver preenchida. Este provider só cuida do
 * ciclo de vida da conexão — eventos de domínio (notificações, dashboard,
 * etc.) devem ser registrados por cada projeto conforme necessário.
 */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isEnabled("websocket.enabled") || !siteConfig.webSocketUrl) {
      return;
    }

    const readToken = () =>
      getFirstCookieValue(parseCookies(), sessionCookieNames.token);

    const token = readToken();
    if (!token) return;

    const client = io(siteConfig.webSocketUrl, {
      auth: (cb) => cb({ token: readToken() }),
      transports: ["websocket", "polling"],
    });

    client.on("connect", () => {
      toast.dismiss(SOCKET_CONNECTION_ERROR_TOAST_ID);
      setConnected(true);
    });
    client.on("disconnect", () => {
      setConnected(false);
    });
    client.on("connect_error", (err) => {
      toast.error("Falha na conexão em tempo real", {
        id: SOCKET_CONNECTION_ERROR_TOAST_ID,
        description: getSocketConnectionErrorMessage(err),
      });
      setConnected(false);
    });

    setSocket(client);

    return () => {
      client.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, []);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
