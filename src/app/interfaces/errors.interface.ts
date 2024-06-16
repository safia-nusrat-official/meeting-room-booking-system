export type TErrorSources = {
    path: number | string
    message: string
}[]

export interface TGenericErrorResponse {
    statusCode: number
    errMsg: string
    errorSources: TErrorSources
}
