// SPDX-License-Identifier: GPL-3.0-only
import { request, uploadRequest, userIdPreCheck } from "./request";
import {
  ItemGroupTag,
  Person,
  SoliderGroupRes,
  StashItem,
} from "../models/person";
import { Profile } from "../models/profile";
import { API_PREFIX } from "../constants";

export const PERSON_API_PREFIX = "person";

export const PersonService = {
  query: async (id?: number) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "GET",
      `${PERSON_API_PREFIX}/query/${id ?? user_id}`
    )) as Promise<Person>;
  },
  queryAll: async () => {
    const user_id = await userIdPreCheck();

    return (await request("GET", `${PERSON_API_PREFIX}/query_all`)) as Promise<
      // 第一项为存档 ID, 第二项才是存档信息, 第三项为用户信息
      Array<[number, Person, Profile]>
    >;
  },
  updateBackpackList: async (data: ItemGroupTag[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/update_backpack/${user_id}`,
      data
    )) as Promise<Person>;
  },
  batchInsertPersonBackpackList: async (
    profile_id_list: number[],
    backpack_item_list: ItemGroupTag[]
  ) => {
    const user_id = await userIdPreCheck();

    const enhancedData: {
      profile_id_list: number[];
      backpack_item_list: ItemGroupTag[];
    } = {
      profile_id_list,
      backpack_item_list,
    };

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/insert_selected_person_backpack`,
      enhancedData
    )) as Promise<void>;
  },
  updateStashList: async (data: ItemGroupTag[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/update_stash/${user_id}`,
      data
    )) as Promise<Person>;
  },
  resetXpTo5Stars: async () => {
    const user_id = await userIdPreCheck();

    return await request(
      "POST",
      `${PERSON_API_PREFIX}/reset_xp_5_stars/${user_id}`
    );
  },
  resetXpCustom: async (xp: number) => {
    const user_id = await userIdPreCheck();

    return await request("POST", `${PERSON_API_PREFIX}/reset_xp/${user_id}`, {
      authority: xp,
    });
  },
  updateSoliderGroup: async (next: string) => {
    const user_id = await userIdPreCheck();

    return await request(
      "POST",
      `${PERSON_API_PREFIX}/update_group_type/${user_id}`,
      {
        group_type: next,
      }
    );
  },
  batchUpdateSoldierGroup: async (
    profile_id_list: number[],
    data: {
      group: string;
      cost: number;
    }
  ) => {
    await userIdPreCheck();

    const enhancedData = {
      profile_id_list,
      group: data.group,
      cost: data.cost,
    };

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/update_selected_person_soldier_group`,
      enhancedData
    )) as Promise<SoliderGroupRes>;
  },
  updateAllSoldierGroup: async (data: { group: string; cost: number }) => {
    await userIdPreCheck();

    const enhancedData = {
      group: data.group,
      cost: data.cost,
    };

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/update_all_person_soldier_group`,
      enhancedData
    )) as Promise<SoliderGroupRes>;
  },
  insertAllPersonBackpack: async (data: StashItem[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/insert_all_person_backpack`,
      data
    )) as Promise<Person>;
  },
  deleteAllItemList: async (data: string[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/delete_item_list`,
      data
    )) as Promise<void>;
  },
  batchDeleteItemList: async (profileIdList: number[], itemList: string[]) => {
    const user_id = await userIdPreCheck();

    const data = {
      profile_id_list: profileIdList,
      item_list: itemList,
    };

    return (await request(
      "POST",
      `${PERSON_API_PREFIX}/delete_selected_person_item_list`,
      data
    )) as Promise<void>;
  },
  download: async () => {
    const user_id = await userIdPreCheck();

    return (await request(
      "GET",
      `${PERSON_API_PREFIX}/download/${user_id}`
    )) as Promise<Person>;
  },
  getDownloadUrl: async () => {
    const user_id = await userIdPreCheck();
    return `${API_PREFIX}/${PERSON_API_PREFIX}/download/${user_id}`;
  },
  upload: async (file: File) => {
    const user_id = await userIdPreCheck();

    const formData = new FormData();
    formData.append("file", file);

    return await uploadRequest(`${PERSON_API_PREFIX}`, formData);
  },
  getUploadUrl: async () => {
    const user_id = await userIdPreCheck();

    return `${API_PREFIX}/${PERSON_API_PREFIX}/upload/${user_id}`;
  },
};
