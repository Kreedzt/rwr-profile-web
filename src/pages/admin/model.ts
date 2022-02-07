import { Person } from "../../models/person";
import { Profile } from "../../models/profile";

export interface PersonListItem {
  profile_id: number;
  username: Profile["username"];
  xp: Person["authority"];
  rp: Person["job_points"];
  squad_tag: Profile["squad_tag"];
}
