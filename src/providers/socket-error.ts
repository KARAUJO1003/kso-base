const SOCKET_CONNECTION_FALLBACK_MESSAGE =
  "Não foi possível conectar às notificações em tempo real.";

export function getSocketConnectionErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return SOCKET_CONNECTION_FALLBACK_MESSAGE;
}