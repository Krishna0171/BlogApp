// import { useContext } from 'react';
// import { SocketContext } from '../context/SocketContext';

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) throw new Error('useSocket must be used within SocketProvider');
//   return context;
// };

// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { initSocket, on, off, emit } from "../api/socket";
import type { RootState } from "../store";
import { useAppSelector } from "./useAppSelector";

export const useSocket = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (user) {
      initSocket({
        userId: user.id,
        sessionId: user.sessionId,
        role: user.role,
      });
      setIsReady(true);
    }
  }, [user]);

  return {
    isReady,
    on,
    off,
    emit,
  };
};
