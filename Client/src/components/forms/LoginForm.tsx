import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { LoginFormData } from "../../interfaces/interfaces";
import { useForm } from "react-hook-form";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Invalid_Email_Format, Required } from "../../constants/errorMessage";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = yup.object({
  email: yup.string().email(Invalid_Email_Format).required(Required("Email")),
  password: yup.string().required(Required("Password")),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useAppSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  }

  const loginHandler = async (data: LoginFormData) => {
    try {
      const response = await api.post("/auth/login", data);
      const token = response.data.token;
      login(token);
      showSuccess("Login Successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      showError(error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(loginHandler)}>
      <TextField
        label="Email"
        margin="normal"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        fullWidth
        margin="normal"
        type={showPassword? "text": "password"}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
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
  );
};

export default LoginForm;
