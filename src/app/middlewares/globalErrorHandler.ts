import { NextFunction, Request, Response } from "express";
import config from "../config";

export function globalErrorHandler(err:any, req:Request, res:Response, next:NextFunction) {
    const statusCode = err?.code || 500
	console.log(err)
    return res.status(500).json({
		succes: false,
		message: err.message,
		stack: config.node_env === 'development' ? err?.stack : null,
		err,
	});
}