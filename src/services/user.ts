// SPDX-License-Identifier: GPL-3.0-only
import { request } from "./request";
import { LoginReq, RegisterReq } from "../models/user";
import { LoginResponse } from "../models/response";

export const UserService = {
  login: async (params: LoginReq) => {
    return request("POST", "user/login", params) as Promise<LoginResponse>;
  },
  register: async (params: RegisterReq) => {
    return request("POST", "user/register", params);
  },
};
