import httpStatus from "http-status"
import QueryBuilder from "../../builder/QueryBuilder"
import config from "../../config"
import AppError from "../../errors/AppError"
import { userSearchableFields } from "./user.constants"
import { TUser } from "./user.interface"
import { User } from "./user.model"

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await userQuery.modelQuery
    const meta = await userQuery.countDocuments()
    return { data: result, meta }
}
export const userServices = {
    getAllUsersFromDB,
}
