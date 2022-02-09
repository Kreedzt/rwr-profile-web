import { API_PREFIX } from "../constants";
import { uploadRequest, userIdPreCheck } from "./request";

export const PROFILE_API_PREFIX = "profile";

export const ProfileService = {
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
};
