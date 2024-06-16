import config from '../config'
import { User } from '../modules/auth/auth.model'
import { catchAsync } from '../utils/catchAsync'
import jwt, { JwtPayload } from "jsonwebtoken"

export const auth = (...roles: ('user' | 'admin')[]) => {
    return catchAsync(async (req, res, next) => {
        console.log(`those who can access this route: `, roles)
        
		const token = req.headers.authorization
        if (!token) {
            throw new Error(`Unauthorized user!`)
        }

		const accessToken = token.split(' ')[1]
		const decoded = jwt.verify(accessToken, config.access_secret as string) as JwtPayload
		console.log(`decoded data from token: `, decoded)
		const user = await User.doesUserExist(decoded.email)
		if(!user){
			throw new Error(`Invalid user token`)
		}
		if (roles && !roles.includes(user.role)) {
			throw new Error(`Forbidden Access!`);
		}
		req.user = decoded;

		next();
    })
}
