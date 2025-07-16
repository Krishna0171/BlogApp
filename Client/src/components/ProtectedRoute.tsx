import { useNavigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "../constants/Routes";
import Loading from "./Loading";
import { useAppSelector } from "../hooks";
import type { RootState } from "../store";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate(ROUTES.Login);
    }
    if (user && !loading && allowedRoles && !allowedRoles.includes(user.role)) {
      navigate(ROUTES.Unauthorized);
    }
  }, [loading, navigate]);

  return loading ? <Loading/> : children;
};

export default ProtectedRoute;
