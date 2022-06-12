// SPDX-License-Identifier: GPL-3.0-only
import React, { FC } from "react";
import { Tabs, Typography } from "antd";
import { Person } from "../../../../models/person";
import { Profile } from "../../../../models/profile";
import ProfileDataView from "../../../../components/ProfileDataView/ProfileDataView";
import PersonDataView from "../../../../components/PersonDataView/PersonDataView";
import BackpackDataList from "../../../../components/BackpackDataList/BackpackDataList";
import StashDataList from "../../../../components/StashDataList/StashDataList";

const { Title } = Typography;
const { TabPane } = Tabs;

type ProfileDataProps = {
  data?: [number, Person, Profile];
};

const ProfileData: FC<ProfileDataProps> = ({ data }) => {
  if (!data) {
    return <div>未找到指定用户</div>;
  }
  return (
    <div>
      <Title level={4}>
        用户ID/名称: {data[0]} / {data[2].username}
      </Title>
      <Tabs>
        <TabPane tab="Profile数据" key="1">
          <ProfileDataView profile={data[2]} />
        </TabPane>
        <TabPane tab="Person数据" key="2">
          <PersonDataView person={data[1]} />
        </TabPane>
        <TabPane tab="背包数据" key="3">
          {/*TODO: 临时使用相同代码*/}
          <StashDataList
            stashDataList={data[1].backpack_item_list}
            max={data[1].backpack_hard_capacity}
          />
        </TabPane>
        <TabPane tab="仓库数据" key="4">
          <StashDataList
            stashDataList={data[1].stash_item_list}
            max={data[1].stash_hard_capacity}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfileData;
