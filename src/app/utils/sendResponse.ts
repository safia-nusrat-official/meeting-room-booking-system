import { Response } from "express"

export type TMeta = {
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
        meta: data.meta,
        data: data.data,
    }
    if (data?.token) {
        response.token = data.token
    }
    return res.status(data.statusCode).json(response)
}
