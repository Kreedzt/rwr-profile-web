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
    sorter: (a, b) => a.xp - b.xp,
  },
  {
    dataIndex: "rp",
    key: "rp",
    title: "rp",
    sorter: (a, b) => a.rp - b.rp,
  },
  {
    dataIndex: "time_played",
    key: "time_played",
    title: "游玩时间",
    sorter: (a, b) => a.time_played - b.time_played,
  },
  {
    dataIndex: "kills",
    key: "kills",
    title: "杀敌数",
    sorter: (a, b) => a.kills - b.kills,
  },
  {
    dataIndex: "deaths",
    key: "deaths",
    title: "死亡数",
    sorter: (a, b) => a.deaths - b.deaths,
  },
  {
    dataIndex: "player_kills",
    key: "player_kills",
    title: "友军击杀数",
    sorter: (a, b) => a.player_kills - b.player_kills,
  },
  {
    dataIndex: "squad_tag",
    key: "squad_tag",
    title: "队伍名称",
  },
];
