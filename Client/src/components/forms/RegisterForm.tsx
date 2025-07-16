import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { RegisterFormData } from "../../interfaces/interfaces";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import {
  InvalidEmailFormat,
  MaxiLengthError,
  MinLengthError,
  MustMatch,
  Required,
} from "../../constants/ErrorMessage";
import * as authService from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { RegisterSuccess } from "../../constants/SuccessMessages";
import { ROUTES } from "../../constants/Routes";
import PasswordInput from "../inputs/PasswordInput";
import { toast } from "react-toastify";

const schema = yup.object({
  name: yup
    .string()
    .required(Required("Name"))
    .max(20, MaxiLengthError("Name", 20))
    .min(3, MinLengthError("Name", 3)),
  email: yup
    .string()
    .email(InvalidEmailFormat)
    .required(Required("Email"))
    .max(50, MaxiLengthError("Email", 50)),
  password: yup
    .string()
    .required(Required("Password"))
    .min(8, MinLengthError("Password", 8))
    .max(30, MaxiLengthError("Password", 30)),
  confirmPassword: yup
    .string()
    .required(Required("Confirm Password"))
    .oneOf([yup.ref("password")], MustMatch("Confirm Password", "Password")),
});

const RegisterForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const registerHandler = async (data: RegisterFormData) => {
    const result = await authService.RegisterUser(data);
    if (result.isSuccess) {
      toast.success(RegisterSuccess);
      navigate(ROUTES.Login);
    } else {
      toast.error(result.Message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(registerHandler)}>
        <TextField
          label="Name"
          margin="normal"
          fullWidth
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
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
        <PasswordInput
        label={"Confirm Password"}
          fullWidth
          margin="normal"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
      <Box textAlign="center" mt={1} letterSpacing={2}>
        Already have an Account? &nbsp;
        <Link
          to={ROUTES.Login}
          className="hover:underline text-blue-500 hover:text-blue-800"
        >
          Login
        </Link>
      </Box>
    </>
  );
};

export default RegisterForm;
