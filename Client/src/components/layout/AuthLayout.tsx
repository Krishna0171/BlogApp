import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { ROUTES } from "../../constants/Routes";
import Loading from "../Loading";

const AuthLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) navigate(ROUTES.Login);
  }, [navigate, loading]);

  return loading ? <Loading/> : <Outlet />;
};

export default AuthLayout;
