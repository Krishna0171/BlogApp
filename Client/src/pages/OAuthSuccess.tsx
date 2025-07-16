import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ROUTES } from "../constants/Routes";
import { useAppDispatch } from "../hooks";
import { initializeAuth } from "../store/slices/authSlice";
import { setToken } from "../utils/jwtUtils";

const OAuthSuccess = () => {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      setToken(token);
      dispatch(initializeAuth());
    }
    navigate(ROUTES.Dashboard);
  }, []);

  return <Loading />;
};

export default OAuthSuccess;
