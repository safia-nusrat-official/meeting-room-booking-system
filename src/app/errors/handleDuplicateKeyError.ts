import {
    TErrorSources,
    TGenericErrorResponse,
} from '../interfaces/errors.interface'

export const handleDuplicateKeyError = (err: any): TGenericErrorResponse => {
    const regex = /{ name: "([^"]+)" }/
    const matchRegex = err.errorResponse.errmsg.match(regex)
    const extractedMsg = matchRegex && matchRegex[1]
    const errorSources: TErrorSources = [
        {
            path: Object.keys(err.keyValue)[0],
            message: `'${extractedMsg}' already exists`,
        },
    ]
    return {
        errMsg: 'Duplicate Error',
        statusCode: 400,
        errorSources,
    }
}
