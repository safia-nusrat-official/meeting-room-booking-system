import { Response } from "express"

type TMeta = {
    page: number
    limit: number
    totalDocuments: number
    totalPages: number
}
type TResponse<TDataType> = {
    statusCode: number
    success: boolean
    message?: string
    data: TDataType
    token?: string
    meta?: TMeta
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
        meta: data.meta,
    }
    if (data?.token) {
        response.token = data.token
    }
    return res.status(data.statusCode).json(response)
}
