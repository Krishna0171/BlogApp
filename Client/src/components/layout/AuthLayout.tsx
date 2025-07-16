import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "../../constants/Routes";
import Loading from "../Loading";
import { useAppSelector } from "../../hooks";
import type { RootState } from "../../store";

const AuthLayout = () => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) navigate(ROUTES.Login);
  }, [navigate, loading]);

  return loading ? <Loading/> : <Outlet />;
};

export default AuthLayout;
