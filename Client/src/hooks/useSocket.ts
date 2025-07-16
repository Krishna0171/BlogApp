// import { useContext } from 'react';
// import { SocketContext } from '../context/SocketContext';

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) throw new Error('useSocket must be used within SocketProvider');
//   return context;
// };

// src/hooks/useSocket.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { initSocket, on, off, emit, disconnectSocket } from "../api/socket";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/Routes";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-toastify";

export const useSocket = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      initSocket({
        sessionId: user.sessionId,
        userId: user.id,
        role: user.role,
      });

      on("force-logout", async () => {
        console.log("sesssionsdfsd");
        const res = await dispatch(logout());
        if (res.payload) {
          navigate(ROUTES.Login);
          toast.info("You are logged out by another user!");
        }
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  return {
    on,
    off,
    emit,
  };
};
