import api, { safeRequest } from "../api/axios";
import { API_ROUTES } from "../constants/Routes";
import type { LoginFormData, RegisterFormData } from "../interfaces/interfaces";
import { errorResult, successResult } from "./ResultHandler";

export const RegisterUser = async (data: RegisterFormData) => {
    const [res, error] = await safeRequest(api.post(API_ROUTES.Register, data));
    if(error) return errorResult(error);
    return successResult(res); 
}

export const LoginUser = async (data: LoginFormData) => {
    const [res, error] = await safeRequest(api.post(API_ROUTES.Login, data));
    if(error) {
        return errorResult(error);
    };
    return successResult(res); 
}