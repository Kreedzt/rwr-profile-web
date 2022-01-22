import { UserInfo } from "../models/user";
import { USER_ID_STORAGE_KEY, USER_NAME_STORAGE_KEY } from "../constants";

export const StorageService = {
  setUserInfo: (userInfo: UserInfo) => {
    localStorage.setItem(USER_ID_STORAGE_KEY, userInfo.user_id.toString());
    localStorage.setItem(USER_NAME_STORAGE_KEY, userInfo.name);
  },
  getUserInfo: (): Omit<UserInfo, "password"> | undefined => {
    const userIdStr = localStorage.getItem(USER_ID_STORAGE_KEY);
    const userName = localStorage.getItem(USER_NAME_STORAGE_KEY);
    if (userIdStr && !Number.isNaN(+userIdStr) && userName) {
      const userInfo: Omit<UserInfo, "password"> = {
        user_id: +userIdStr,
        name: userName,
      };

      return userInfo;
    }
    return undefined;
  },
  clearUserInfo: () => {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    localStorage.removeItem(USER_NAME_STORAGE_KEY);
  },
};
