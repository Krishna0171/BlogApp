import { io, type Socket } from "socket.io-client";
import { useAppDispatch } from "../hooks";

interface UserDetails {
  sessionId: string;
  userId: string;
  role: string;
}

let socket: Socket | null = null;

export const initSocket = (user: UserDetails): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      socket?.emit("register", {
        sessionId: user.sessionId,
        userId: user.userId,
        role: user.role,
      });
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected.");
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const on = (event: string, callback: (data: any) => void): void => {
  socket?.on(event, callback);
};

export const off = (event: string): void => {
  socket?.off(event);
};

export const emit = (event: string, data: any): void => {
  socket?.emit(event, data);
};
