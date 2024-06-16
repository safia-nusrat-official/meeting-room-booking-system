import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import config from '../config'
import { TGenericErrorResponse } from '../interfaces/errors.interface'
import { handleZodError } from '../errors/handleZodError'
import { handleValidationError } from '../errors/handleValidationError'
import { handleCastError } from '../errors/handleCastError'
import AppError from '../errors/AppError'
import { handleDuplicateKeyError } from '../errors/handleDuplicateKeyError'

export function globalErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errorHandlers = {
        ZodError: handleZodError,
        ValidationError: handleValidationError,
        CastError: handleCastError,
        DuplicateKeyError: handleDuplicateKeyError,
    }

    let formattedError: TGenericErrorResponse = {
        statusCode: 500,
        errMsg: 'Something went wrong.',
        errorSources: [
            {
                path: '',
                message: 'Something went wrong.',
            },
        ],
    }

    if (err instanceof ZodError) {
        formattedError = errorHandlers.ZodError(err)
    } else if (err?.name === 'ValidationError') {
        formattedError = errorHandlers.ValidationError(err)
    } else if (err?.name === 'CastError') {
        formattedError = errorHandlers.CastError(err)
    } else if (err?.code === 11000) {
        formattedError = errorHandlers.DuplicateKeyError(err)
    } else if (err instanceof AppError) {
        formattedError = {
            statusCode: err.statusCode,
            errMsg: err.message,
            errorSources: [
                {
                    path: '',
                    message: err.message,
                },
            ],
        }
    } else if (err instanceof Error) {
        formattedError.errMsg = err.message
        formattedError.errorSources[0].message = err.message
    }

    const { statusCode, errMsg, errorSources } = formattedError

    return res.status(statusCode).json({
        succes: false,
        message: errMsg,
        errorSources,
        stack: config.node_env === 'development' ? err?.stack : null,
        err,
    })
}
