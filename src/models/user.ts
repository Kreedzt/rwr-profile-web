export interface UserInfo {
    user_id: number;
    name: string;
    password: string;
    admin: number;
}
export interface LoginReq {
    username: string;
    password: string;
}

export type RegisterReq = LoginReq;