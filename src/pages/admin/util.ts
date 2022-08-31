// SPDX-License-Identifier: GPL-3.0-only
import { ModeEnum } from "./enum";
import { PersonListItem } from "./model";
import { QueryItem, QueryModeEnum, QueryTypeEnum } from "./type";
import { Profile } from "../../models/profile";
import { Person } from "../../models/person";

export const parseQueryItem = (
  item: PersonListItem,
  query: QueryItem
): boolean => {
  const targetValue = item[query.key];
  const compareValue = query.value;
  switch (query.type) {
    case QueryTypeEnum.LESS:
      return targetValue < compareValue;
    case QueryTypeEnum.GREATER:
      return targetValue > compareValue;
    case QueryTypeEnum.EQUAL: {
      return targetValue.toString() === compareValue;
    }
    case QueryTypeEnum.CONTAIN: {
      return targetValue.toString().includes(compareValue);
    }
  }
};

export const parseQueryList = (
  item: PersonListItem,
  queryList: QueryItem[],
  mode: QueryModeEnum
): boolean => {
  let res = false;

  switch (mode) {
    case "all":
      res = queryList.every((q) => {
        return parseQueryItem(item, q);
      });
      break;
    case "one":
      res = queryList.some((q) => {
        return parseQueryItem(item, q);
      });
      break;
  }

  return res;
};

export const parseEffectedCountText = (
  mode: ModeEnum,
  checkedList: number[],
  displayList: PersonListItem[]
): string => {
  switch (mode) {
    case ModeEnum.ALL:
      return "全服玩家";
    case ModeEnum.LIST:
      return `${displayList.length}位玩家`;
    case ModeEnum.CHECKED:
      return `${checkedList.length}位玩家`;
  }
};

export const transformToPersonListItem = (
  id: number,
  person: Person,
  profile: Profile
): PersonListItem => {
  const resInfo: PersonListItem = {
    profile_id: id,
    username: profile.username,
    xp: person.authority,
    rp: person.job_points,
    squad_tag: profile.squad_tag,
    sid: profile.sid,
    time_played: profile.stats.time_played,
    kills: profile.stats.kills,
    deaths: profile.stats.deaths,
    player_kills: profile.stats.player_kills,
    soldier_group: person.soldier_group_name,
    associated_count: 1,
  };

  return resInfo;
};
