import api, { safeRequest } from "../api/axios";
import { API_ROUTES } from "../constants/Routes";
import type {
  LoginFormData,
  RegisterFormData,
  ResetPasswordData,
} from "../interfaces/interfaces";
import { errorResult, successResult } from "./ResultHandler";

export const RegisterUser = async (data: RegisterFormData) => {
  const [res, error] = await safeRequest(api.post(API_ROUTES.Register, data));
  if (error) return errorResult(error);
  return successResult(res);
};

export const loginUser = async (data: LoginFormData) => {
  const [res, error] = await safeRequest(api.post(API_ROUTES.Login, data));
  if (error) {
    return errorResult(error);
  }
  return successResult(res);
};

export const logoutUser = async () => {
  const [res, error] = await safeRequest(api.post(API_ROUTES.Logout, null));
  if (error) {
    return errorResult(error);
  }
  return successResult(res);
};

export const refreshAccessToken = async () => {
  const [res, error] = await safeRequest(
    api.post(API_ROUTES.RefreshToken, null)
  );
  if (error) return errorResult(error);
  return successResult(res);
};

export const forgotPassword = async (email: string) => {
  const [res, error] = await safeRequest(
    api.post(API_ROUTES.ForgotPassword, { email })
  );
  if (error) {
    return errorResult(error);
  }
  return successResult(res);
};

export const resetPassword = async (data: ResetPasswordData) => {
  const [res, error] = await safeRequest(
    api.post(API_ROUTES.ResetPassword, data)
  );
  if (error) return errorResult(error);
  return successResult(res);
};
