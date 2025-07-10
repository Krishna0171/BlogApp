import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { LoginFormData } from "../../interfaces/interfaces";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InvalidEmailFormat, Required } from "../../constants/ErrorMessage";
import * as authService from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PasswordInput from "../inputs/PasswordInput";
import { LoginSuccess } from "../../constants/SuccessMessages";
import { ROUTES } from "../../constants/Routes";
import { toast } from "react-toastify";
import { GitHub } from "@mui/icons-material";
import ForgotPassword from "../ForgotPassword";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email(InvalidEmailFormat).required(Required("Email")),
  password: yup.string().required(Required("Password")),
  rememberMe: yup.boolean().default(false),
});

const LoginForm = () => {
  const [showForgotDialog, setShowForgotDialog] = useState<boolean>(false);

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
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={1}
        >
          <FormControlLabel
            control={<Checkbox />}
            label="Remember me"
            {...register("rememberMe")}
          />

          {/* <Link
            to={ROUTES.ForgotPassword}
            className="hover:underline text-blue-500 hover:text-blue-800 tracking-wider"
          >
            Forgot Password?
          </Link> */}
          <Button
            onClick={() => setShowForgotDialog(true)}
            className="hover:underline text-blue-500 hover:text-blue-800 tracking-wider"
            sx={{ mt: 2 }}
            variant="text"
          >
            Forgot Password?
          </Button>
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
      <Box textAlign="center" my={1} letterSpacing={2}>
        Don't have an Account? &nbsp;
        <Link
          to={ROUTES.Register}
          className="hover:underline text-blue-500 hover:text-blue-800"
        >
          Register
        </Link>
      </Box>

      <Stack gap={2} mt={5}>
        <Typography variant="body2" fontWeight={"bold"} textAlign={"center"}>
          --- Or Login with ---
        </Typography>
        <Button
          variant="contained"
          color="info"
          startIcon={
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "2px",
              }}
            >
              <img
                className="w-4 h-4"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
            </Box>
          }
          onClick={() =>
            (window.location.href = `http://localhost:5000/api/auth/google`)
          }
        >
          Login with Google
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "GrayText" }}
          startIcon={<GitHub />}
          onClick={() =>
            (window.location.href = `http://localhost:5000/api/auth/github`)
          }
        >
          Login with Github
        </Button>
      </Stack>
      <ForgotPassword
        open={showForgotDialog}
        onClose={() => setShowForgotDialog(false)}
      />
    </>
  );
};

export default LoginForm;
