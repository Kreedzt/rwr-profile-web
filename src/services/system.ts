// SPDX-License-Identifier: GPL-3.0-only
import { QuickItem } from "../models/system";
import { request, userIdPreCheck } from "./request";

export const SYSTEM_API_PREFIX = "system";

export const SystemService = {
  queryQuickItems: async () => {
    const user_id = await userIdPreCheck();

    return (await request(
      "GET",
      `${SYSTEM_API_PREFIX}/query_quick_items`
    )) as Promise<QuickItem[]>;
  },
  updateQuickItems: async (params: QuickItem[]) => {
    const user_id = await userIdPreCheck();

    return (await request(
      "POST",
      `${SYSTEM_API_PREFIX}/update_quick_items`,
      params
    )) as Promise<any>;
  },
};
