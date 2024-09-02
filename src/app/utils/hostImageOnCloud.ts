import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import AppError from '../errors/AppError';

cloudinary.config({
	cloud_name: config.cloud_name,
	api_key: config.cloudinary_api_key,
	api_secret: config.cloudinary_api_secret,
});

export default async function hostImageOnCloud(imgPath: string, imgName: string) {
	const uploadResult = await cloudinary.uploader
		.upload(imgPath, {
			public_id: imgName,
		})
		.catch((error) => {
			console.log(error);
			throw new AppError(500, `Failed to host image on cloudinary.`);
		});

	// Transform the image: auto-crop to square aspect_ratio
	const autoCropUrl = cloudinary.url(imgName, {
		crop: 'auto',
		gravity: 'auto',
		width: 200,
		height: 200,
	});
	
	console.log(autoCropUrl)
	return uploadResult;
}
