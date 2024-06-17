import httpStatus from "http-status"
import config from "../config"
import AppError from "../errors/AppError"
import { User } from "../modules/auth/auth.model"
import { catchAsync } from "../utils/catchAsync"
import jwt, { JwtPayload } from "jsonwebtoken"

export const auth = (...roles: ("user" | "admin")[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, `Unauthorized user!`)
        }

        const accessToken = token.split(" ")
        if (accessToken[0] !== "Bearer") {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `You must include Bearer at the beginning of the token followd by a space.`
            )
        }

        jwt.verify(
            accessToken[1],
            config.access_secret as string,
            async (error, decoded) => {
                try {
                    if (error) {
                        if (error.name === "TokenExpiredError") {
                            throw new AppError(
                                httpStatus.UNAUTHORIZED,
                                `Token Expired!`
                            )
                        } else {
                            throw new AppError(
                                httpStatus.UNAUTHORIZED,
                                `Unauthorised User!`
                            )
                        }
                    }

                    const user = await User.doesUserExist(
                        (decoded as JwtPayload).email
                    )
                    if (!user) {
                        throw new Error(`Invalid user token`)
                    }
                    if (roles && !roles.includes(user.role)) {
                        throw new Error(`Forbidden Access`)
                    }
                    req.user = decoded as JwtPayload

                    next()
                } catch (err) {
                    next(err)
                }
            }
        )
    })
}
