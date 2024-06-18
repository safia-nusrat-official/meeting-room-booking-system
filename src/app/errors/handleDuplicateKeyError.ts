import {
    TErrorSources,
    TGenericErrorResponse,
} from "../interfaces/errors.interface"

export const handleDuplicateKeyError = (err: any): TGenericErrorResponse => {
    const matchRegex = err.errorResponse.errmsg.split("{")
    const extractedMsg = ((matchRegex && matchRegex[1]) as string).split("}")[0]
    const errorSources: TErrorSources = [
        {
            path: Object.keys(err.keyValue)[0],
            message: err?.errorResponse?.errmsg||`'${extractedMsg}' already exists`,
        },
    ]
    return {
        errMsg: "Duplicate Error",
        statusCode: 400,
        errorSources,
    }
}
