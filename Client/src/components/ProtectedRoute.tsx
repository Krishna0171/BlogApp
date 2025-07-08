import { useNavigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/Routes";
import Loading from "./Loading";

type Props = {
  children: ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate(ROUTES.Login);
    }
    if (user && !loading && !allowedRoles.includes(user.role)) {
      navigate(ROUTES.Unauthorized);
    }
  }, [loading, navigate]);

  return loading ? <Loading/> : children;
};

export default ProtectedRoute;
