import api, { safeRequest } from "../api/axios";
import { ApiRoutes } from "../constants/Routes";
import type { LoginFormData, RegisterFormData } from "../interfaces/interfaces";
import { errorResult, successResult } from "./ResultHandler";

export const RegisterUser = async (data: RegisterFormData) => {
    const [res, error] = await safeRequest(api.post(ApiRoutes.Register, data));
    if(error) return errorResult(error);
    return successResult(res); 
}

export const LoginUser = async (data: LoginFormData) => {
    const [res, error] = await safeRequest(api.post(ApiRoutes.Login, data));
    console.log(error)
    if(error) {
        return errorResult(error);
    };
    return successResult(res); 
}