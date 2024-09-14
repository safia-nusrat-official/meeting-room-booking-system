import { v2 as cloudinary } from "cloudinary"
import config from "../config"
import AppError from "../errors/AppError"

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
})

export default async function hostImageOnCloud(buffer: any, imgName: string) {
    try {
        console.log(buffer)
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    format:"png",
                    public_id: imgName,
                },
                (error, result) => {
                    if (error) {
                        console.log("Failed to upload on cloudinary", error)
                        reject(new AppError(
                            500,
                            "Failed to upload on cloudinary"
                        ))
                    }
                    resolve(result)
                }
            )
            stream.end(buffer)
        })

        return uploadResult
    } catch (error) {
        console.log("Failed to upload on cloudinary", error)
        throw new AppError(500, "Failed to upload on cloudinary")
    }
}
