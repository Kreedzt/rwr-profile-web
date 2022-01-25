import { ErrorResponse } from "../models/response";
import { message } from "antd";
import { StorageService } from "./storage";
import { USER_ID_NOT_FOUND_MSG } from "../constants";

export const userIdPreCheck = async (): Promise<number> => {
  const user_id = StorageService.getUserInfo()?.user_id;

  if (!user_id) {
    message.error(USER_ID_NOT_FOUND_MSG);
    return Promise.reject({
      message: USER_ID_NOT_FOUND_MSG,
    });
  }

  return +user_id;
};

export const request = (
  method: "GET" | "POST",
  url: string,
  params?: Record<string, any>
) => {
  console.log("request params", method, url, params);
  return fetch(`/api/${url}`, {
    method,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: params ? JSON.stringify(params) : null,
  })
    .then((r) => r.json())
    .then((res: ErrorResponse | Record<string, any>) => {
      console.log("fetch res", res);
      if ("code" in res && res.code !== 0) {
        message.error(`Server Error: ${res.message}`);
        return Promise.reject(res);
      }
      return Promise.resolve(res);
    });
};