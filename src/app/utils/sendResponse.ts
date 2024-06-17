import { Response } from "express"

type TResponse<TDataType> = {
    statusCode: number
    success: boolean
    message?: string
    data: TDataType
    token?: string
}
export function sendResponse<TDataType>(
    data: TResponse<TDataType>,
    res: Response
) {
    let response: TResponse<TDataType> = {
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
    }
    if (data?.token) {
        response.token = data.token
    }
    return res.status(data.statusCode).json(response)
}
