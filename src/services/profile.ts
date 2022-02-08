import { API_PREFIX } from "../constants";
import { userIdPreCheck } from "./request";

const PROFILE_API_PREFIX = "profile";

export const ProfileService = {
  getDownloadUrl: async () => {
    const user_id = await userIdPreCheck();
    return `${API_PREFIX}/${PROFILE_API_PREFIX}/download/${user_id}`;
  },
};
