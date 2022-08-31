import { Person } from "./person";
import { Profile } from "./profile";

export type QueryDataItem = [number, Person, Profile];

export interface StorageQueryItem {
  timeStamp: number;
  dataList: QueryDataItem[];
}
