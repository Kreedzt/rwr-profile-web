import { PersonListItem } from "./model";
import { QueryModeEnum, QueryTypeEnum } from "./type";

export const PersonListItemMapper: Record<keyof PersonListItem, string> = {
  profile_id: "存档ID",
  username: "用户名",
  xp: "XP",
  rp: "RP",
  squad_tag: "小队名称",
  sid: "sid",
  time_played: "游玩时间",
  kills: "击杀数",
  deaths: "死亡数",
  player_kills: "玩家击杀数",
  soldier_group: '兵种',
  associated_count: "关联用户数量",
};

export const QueryTypeMapper: Record<QueryTypeEnum, string> = {
  [QueryTypeEnum.CONTAIN]: "包含",
  [QueryTypeEnum.EQUAL]: "等于",
  [QueryTypeEnum.GREATER]: "大于",
  [QueryTypeEnum.LESS]: "小于",
};

export const QueryModeMapper: Record<QueryModeEnum, string> = {
  [QueryModeEnum.ALL]: "全部条件满足",
  [QueryModeEnum.ONE]: "满足其一即可",
};
