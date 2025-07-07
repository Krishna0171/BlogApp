import {type AxiosResponse } from "axios"

export const successResult = (response:AxiosResponse<any>, message: string = "Operation successful!") => {
    console.log(response)
    return {      
        Data: response.data,
        isSuccess: true,
        Message: message
    }
}

export const errorResult = (error:string) => {
    return {
        isSuccess: false,
        Message: error,
        Data: null
    }
}