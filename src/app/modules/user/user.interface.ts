export interface TUser {
    name: string
    email: string
    password: string
    phone: string
    address: string
    profileImage?: string
    isDeleted?: boolean
    role: "admin" | "user"
}
