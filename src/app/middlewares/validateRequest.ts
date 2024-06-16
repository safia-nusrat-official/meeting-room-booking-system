import { AnyZodObject } from 'zod';
import { catchAsync } from '../utils/catchAsync';

export const validateRequest = (validationSchema: AnyZodObject) => {
	return catchAsync(async (req, res, next) => {
 		await validationSchema.parseAsync({ 
			body: req.body,
			cookies:req.cookies
		});
		next();
	});
};
