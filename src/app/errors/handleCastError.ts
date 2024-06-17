import mongoose from "mongoose"
import {
    TErrorSources,
    TGenericErrorResponse,
} from "../interfaces/errors.interface"
import httpStatus from "http-status"

export const handleCastError = (
    err: mongoose.Error.CastError
): TGenericErrorResponse => {
    const errorSources: TErrorSources = [
        {
            path: err.path,
            message: `Invalid value '${err.value}' provided for '${err.path}' . Expected a valid ObjectID.`,
        },
    ]
    return {
        statusCode: httpStatus.BAD_REQUEST,
        errMsg: "Invalid ID",
        errorSources,
    }
}
