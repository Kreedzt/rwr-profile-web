import { request, userIdPreCheck } from "./request";
import { Person, StashItem } from "../models/person";
import { Profile } from "../models/profile";

export const PersonService = {
  query: async () => {
    const user_id = await userIdPreCheck();

    return (await request("GET", `person/query/${user_id}`)) as Promise<Person>;
  },
  queryAll: async () => {
    const user_id = await userIdPreCheck();

    return (await request("GET", `person/query_all`)) as Promise<
      // 第一项为存档 ID, 第二项才是存档信息, 第三项为用户信息
      Array<[number, Person, Profile]>
    >;
  },
  updateBackpackList: async (data: StashItem[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `person/update_backpack/${user_id}`,
      data
    )) as Promise<Person>;
  },
  insertSelectedPersonBackpackList: async (
    profile_id_list: number[],
    backpack_item_list: StashItem[]
  ) => {
    const user_id = await userIdPreCheck();

    const enhancedData: {
      profile_id_list: number[];
      backpack_item_list: StashItem[];
    } = {
      profile_id_list,
      backpack_item_list,
    };

    return (await request(
      "POST",
      `person/insert_selected_person_backpack`,
      enhancedData
    )) as Promise<void>;
  },
  updateStashList: async (data: StashItem[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `person/update_stash/${user_id}`,
      data
    )) as Promise<Person>;
  },
  resetXpTo5Stars: async () => {
    const user_id = await userIdPreCheck();

    return await request("POST", `/person/reset_xp_5_stars/${user_id}`);
  },
  updateGroupData: async (next: string) => {
    const user_id = await userIdPreCheck();

    return await request("POST", `/person/update_group_type/${user_id}`, {
      group_type: next,
    });
  },
  insertAllPersonBackpack: async (data: StashItem[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `person/insert_all_person_backpack`,
      data
    )) as Promise<Person>;
  },
};
