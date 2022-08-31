// SPDX-License-Identifier: GPL-3.0-only
import { API_PREFIX } from "../constants";
import { request, uploadRequest, userIdPreCheck } from "./request";
import { Profile } from "../models/profile";

export const PROFILE_API_PREFIX = "profile";

export const ProfileService = {
  query: async (id?: number) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "GET",
      `${PROFILE_API_PREFIX}/query/${id ?? user_id}`
    )) as Promise<Profile>;
  },
  getDownloadUrl: async () => {
    const user_id = await userIdPreCheck();
    return `${API_PREFIX}/${PROFILE_API_PREFIX}/download/${user_id}`;
  },
  upload: async (file: File) => {
    const user_id = await userIdPreCheck();

    const formData = new FormData();
    formData.append("file", file);

    return await uploadRequest(`${PROFILE_API_PREFIX}`, formData);
  },
  getUploadUrl: async () => {
    const user_id = await userIdPreCheck();

    return `${API_PREFIX}/${PROFILE_API_PREFIX}/upload/${user_id}`;
  },
  updateAllSquadTag: async (st: string) => {
    await userIdPreCheck();

    const enhancedData = {
      squad_tag: st,
    };

    return await request(
      "POST",
      `${PROFILE_API_PREFIX}/update_all_profile_squad_tag`,
      enhancedData
    );
  },
  updateSelectedPersonSquadTag: async (pidList: number[], st: string) => {
    await userIdPreCheck();

    const enhancedData = {
      profile_id_list: pidList,
      squad_tag: st,
    };

    return await request(
      "POST",
      `${PROFILE_API_PREFIX}/update_selected_profile_squad_tag`,
      enhancedData
    );
  },
};
