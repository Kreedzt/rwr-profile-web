// SPDX-License-Identifier: GPL-3.0-only
import { Person } from "../../models/person";
import { Profile, Stats } from "../../models/profile";

export interface PersonListItem {
  profile_id: number;
  username: Profile["username"];
  xp: Person["authority"];
  rp: Person["job_points"];
  squad_tag: Profile["squad_tag"];
  sid: Profile['sid'];
  time_played: Stats["time_played"];
  kills: Stats["kills"];
  deaths: Stats["deaths"];
  soldier_group: string;
  player_kills: Stats["player_kills"];
  // 关联用户名数量
  associated_count: number;
}
