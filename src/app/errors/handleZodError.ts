import { ZodError, ZodIssue } from "zod"
import httpStatus from "http-status"
import {
    TErrorSources,
    TGenericErrorResponse,
} from "../interfaces/errors.interface"

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue?.message,
        }
    })

    const statusCode = httpStatus.BAD_REQUEST
    return {
        statusCode,
        errMsg:
            errorSources.map((error) => error.message).join("  ") ||
            "zod validation error",
        errorSources,
    }
}
