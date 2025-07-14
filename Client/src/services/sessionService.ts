import api, { safeRequest } from "../api/axios";
import { API_ROUTES } from "../constants/Routes";
import { errorResult, successResult } from "./ResultHandler";

export const getAllSessions = async () => {
  const [res, error] = await safeRequest(
    api.get(API_ROUTES.GetSessions)
  );
  if (error) return errorResult(error);
  return successResult(res);
};

export const logoutSession = async (id: string) => {
  const [res, error] = await safeRequest(
    api.post(API_ROUTES.LogoutSession(id), null)
  );
  if (error) return errorResult(error);
  return successResult(res);
};

export const logoutAllSessions = async () => {
  const [res, error] = await safeRequest(
    api.post(API_ROUTES.LogoutAllSessions, null)
  );
  if (error) return errorResult(error);
  return successResult(res);
};
