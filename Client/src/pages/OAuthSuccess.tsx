import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";
import { ROUTES } from "../constants/Routes";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const { login } = useAuth(); // your context method
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      login(token);
      navigate(ROUTES.Dashboard);
    } else {
      navigate(ROUTES.Dashboard);
    }
  }, []);

  return <Loading />;
};

export default OAuthSuccess;
