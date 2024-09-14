import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.join(process.cwd(), ".env"),
})

export default {
    cloud_name: process.env.CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    node_env: process.env.NODE_ENV,
    access_secret: process.env.JWT_ACCESS_SECRET,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    paypal_client_id: process.env.PAYPAL_CLIENT_ID,
    paypal_secret: process.env.PAYPAL_SECRET,
    paypal_base_url: process.env.PAYPAL_BASE_URL,
    smtp_credentials: process.env.SMTP_CREDENTIALS,
}
