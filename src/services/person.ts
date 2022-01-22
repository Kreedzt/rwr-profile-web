import { request, userIdPreCheck } from "./request";
import { Person, StashItem } from "../models/person";

export const PersonService = {
  query: async () => {
    const user_id = await userIdPreCheck();

    return (await request("GET", `person/query/${user_id}`)) as Promise<Person>;
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
};
