import * as yup from "yup";
import {
  MaxiLengthError,
  MinLengthError,
  MustMatch,
  Required,
} from "../../constants/ErrorMessage";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { type ResetPasswordData } from "../../interfaces/interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasswordInput from "../inputs/PasswordInput";
import { resetPassword } from "../../services/authService";
import { toast } from "react-toastify";
import { ResetPasswordSuccess } from "../../constants/SuccessMessages";
import { ROUTES } from "../../constants/Routes";

const ResetPasswordForm = () => {
  const [query] = useSearchParams();
  const navigate = useNavigate();

  const token = query.get("token");

  const schema = yup.object({
    token: yup.string().default(token),
    newPassword: yup
      .string()
      .required(Required("New Password"))
      .min(8, MinLengthError("New Password", 8))
      .max(30, MaxiLengthError("New Password", 30)),
    confirmPassword: yup
      .string()
      .required(Required("Confirm Password"))
      .oneOf(
        [yup.ref("newPassword")],
        MustMatch("Confirm Password", "New Password")
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: yupResolver(schema),
  });

  const handleResetPassword = async (data: ResetPasswordData) => {
    const result = await resetPassword(data);
    if (result.isSuccess) {
      toast.success(ResetPasswordSuccess);
      navigate(ROUTES.Login);
    } else {
      toast.error(result.Message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleResetPassword)}>
      <PasswordInput
        label="New Password"
        fullWidth
        {...register("newPassword")}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        margin="normal"
      />
      <PasswordInput
        label={"Confirm Password"}
        fullWidth
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
        sx={{ mt: 2 }}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
