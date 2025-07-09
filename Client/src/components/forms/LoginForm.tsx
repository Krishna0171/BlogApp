import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { LoginFormData } from "../../interfaces/interfaces";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { InvalidEmailFormat, Required } from "../../constants/ErrorMessage";
import * as authService from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PasswordInput from "../inputs/PasswordInput";
import { LoginSuccess } from "../../constants/SuccessMessages";
import { ROUTES } from "../../constants/Routes";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup.string().email(InvalidEmailFormat).required(Required("Email")),
  password: yup.string().required(Required("Password")),
  rememberMe: yup.boolean().default(false),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const loginHandler = async (data: LoginFormData) => {
    const result = await authService.LoginUser(data);
    if (result.isSuccess) {
      const token = result.Data.token;
      login(token);
      toast.success(LoginSuccess);
      navigate(ROUTES.Dashboard);
    } else {
      toast.error(result.Message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(loginHandler)}>
        <TextField
          label="Email"
          margin="normal"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <PasswordInput
          fullWidth
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Remember me"
          {...register("rememberMe")}
        />

        <Box textAlign="right" mt={1}>
          <Link
            to={ROUTES.ForgotPassword}
            className="hover:underline text-blue-500 hover:text-blue-800"
          >
            Forgot Password?
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
      <Box textAlign="center" mt={1}>
        Don't have an Account?
        <Link
          to={ROUTES.Register}
          className="ms-2 hover:underline text-blue-500 hover:text-blue-800"
        >
          Register
        </Link>
      </Box>

      <Button onClick={() => (window.location.href = `http://localhost:5000/api/auth/google`)}>
        Login with Google
      </Button>
    </>
  );
};

export default LoginForm;
