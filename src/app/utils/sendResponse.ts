import { Response } from 'express';

type response<TDataType> = {
	statusCode: number;
	success: boolean;
	message?: string;
	data: TDataType;
};
export function sendResponse<TDataType>(data: response<TDataType>, res: Response) {
	return res.status(data.statusCode).json({
		success: data.success,
		statusCode:data.statusCode,
		message: data.message,
		data: data.data,
	});
}
