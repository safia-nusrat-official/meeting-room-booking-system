import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.join(process.cwd(), ".env"),
})

export default {
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    node_env: process.env.NODE_ENV,
    access_secret: process.env.JWT_ACCESS_SECRET,
    stripe_secret_key:process.env.VITE_STRIPE_SECRET_KEY,
}
