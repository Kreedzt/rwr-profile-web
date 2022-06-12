// SPDX-License-Identifier: GPL-3.0-only
import React, { FC } from "react";
import { Profile } from "../../models/profile";

type ProfileDataViewProps = {
  profile: Profile;
};

const ProfileDataView: FC<ProfileDataViewProps> = ({ profile }) => {
  return (
    <div>
      <div className="stat-block">
        <span>游玩时间：</span>
        <span>{profile.stats.time_played}秒</span>
      </div>
      <div className="stat-block">
        <span>小队标签：</span>
        <span>{profile.squad_tag}</span>
      </div>
      <div className="stat-block">
        <span>杀敌数：</span>
        <span>{profile.stats.kills}</span>
      </div>
      <div className="stat-block">
        <span>死亡数：</span>
        <span>{profile.stats.deaths}</span>
      </div>
      <div className="stat-block">
        <span>开火次数：</span>
        <span>{profile.stats.shots_fired}</span>
      </div>
      <div className="stat-block">
        <span>治疗数：</span>
        <span>{profile.stats.soldiers_healed}</span>
      </div>
      <div className="stat-block">
        <span>目标摧毁数：</span>
        <span>{profile.stats.targets_destroyed}</span>
      </div>
      <div className="stat-block">
        <span>误伤友方数：</span>
        <span>{profile.stats.team_kills}</span>
      </div>
      <div className="stat-block">
        <span>投掷物投掷次数：</span>
        <span>{profile.stats.throwables_thrown}</span>
      </div>

      <div className="stat-block">
        <span>被治疗次数：</span>
        <span>{profile.stats.times_got_healed}</span>
      </div>
      <div className="stat-block">
        <span>载具摧毁数：</span>
        <span>{profile.stats.vehicles_destroyed}</span>
      </div>
    </div>
  );
};

export default ProfileDataView;
