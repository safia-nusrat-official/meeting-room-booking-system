import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
export function notFoundErrorHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    return res.status(httpStatus.NOT_FOUND).send({
        success: false,
        message: 'Route not found',
    })

    next()
}
