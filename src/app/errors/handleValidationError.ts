import httpStatus from "http-status"
import mongoose from "mongoose"
import {
    TErrorSources,
    TGenericErrorResponse,
} from "../interfaces/errors.interface"

export const handleValidationError = (
    err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
    const errorSources: TErrorSources = Object.values(err.errors).map(
        (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: error?.path,
                message: error?.message,
            }
        }
    )

    return {
        statusCode: httpStatus.BAD_REQUEST,
        errMsg: "Mongoose Validation Error!",
        errorSources,
    }
}
