// SPDX-License-Identifier: GPL-3.0-only
import { UserInfo } from "../models/user";
import {
  QUERY_LIST_STORAGE_KEY,
  USER_ADMIN_KEY,
  USER_ID_STORAGE_KEY,
  USER_NAME_STORAGE_KEY,
} from "../constants";
import { StorageQueryItem } from "../models/query";
import localforage from "localforage";

export const StorageService = {
  setUserInfo: (userInfo: UserInfo) => {
    localStorage.setItem(USER_ID_STORAGE_KEY, userInfo.user_id.toString());
    localStorage.setItem(USER_NAME_STORAGE_KEY, userInfo.name);
    localStorage.setItem(USER_ADMIN_KEY, userInfo.admin.toString());
  },
  getUserInfo: (): Omit<UserInfo, "password"> | undefined => {
    const userIdStr = localStorage.getItem(USER_ID_STORAGE_KEY);
    const userName = localStorage.getItem(USER_NAME_STORAGE_KEY);
    const admin = localStorage.getItem(USER_ADMIN_KEY);
    if (admin && userIdStr && !Number.isNaN(+userIdStr) && userName) {
      const userInfo: Omit<UserInfo, "password"> = {
        user_id: +userIdStr,
        name: userName,
        admin: +admin,
      };

      return userInfo;
    }
    return undefined;
  },
  clearUserInfo: () => {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    localStorage.removeItem(USER_NAME_STORAGE_KEY);
  },
  pushQueryDataList: async (next: StorageQueryItem) => {
    const storageList: StorageQueryItem[] =
      (await localforage.getItem(QUERY_LIST_STORAGE_KEY)) ?? [];
    const newStorageList = [...storageList, next];
    await localforage.setItem(QUERY_LIST_STORAGE_KEY, newStorageList);
  },
  getQueryDataList: async () => {
    const res = localforage.getItem(QUERY_LIST_STORAGE_KEY) as Promise<
      StorageQueryItem[] | undefined
    >;

    return res;
  },
  clearQueryDataList: async () => {
    await localforage.removeItem(QUERY_LIST_STORAGE_KEY);
  },
  updateQueryDataList: async (next: StorageQueryItem[]) => {
    await localforage.setItem(QUERY_LIST_STORAGE_KEY, next);
  },
};
