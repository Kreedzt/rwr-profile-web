import { ColumnType } from "antd/es/table";
import { PersonListItem } from "./model";

export const PERSON_LIST_COLUMNS: ColumnType<PersonListItem>[] = [
  {
    dataIndex: "profile_id",
    key: "profile_id",
    title: "存档ID",
  },
  {
    dataIndex: "username",
    key: "username",
    title: "用户名",
  },
  {
    dataIndex: "xp",
    key: "xp",
    title: "xp",
  },
  {
    dataIndex: "rp",
    key: "rp",
    title: "rp",
  },
  {
    dataIndex: "squad_tag",
    key: "squad_tag",
    title: "队伍名称",
  },
];
