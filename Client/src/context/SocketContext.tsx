import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

interface SocketContextType {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  off: (event: string) => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const setupSocket = useCallback(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      socket.emit("register", {
        sessionId: user?.sessionId,
        userId: user?.id,
        role: user?.role,
      });

      socket.on("force-logout", () => {
        logout();
        toast.info("You are logged out by another user!");
      });
    });

    socketRef.current = socket;
  }, [user, logout]);

  useEffect(() => {
    setupSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const off = useCallback((event: string) => {
    socketRef.current?.off(event);
  }, []);

  return (
    <SocketContext.Provider value={{ on, off, emit }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
