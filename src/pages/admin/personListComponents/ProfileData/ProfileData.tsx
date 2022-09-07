// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useState } from "react";
import {Button, message, Tabs, Typography} from "antd";
import { Person } from "../../../../models/person";
import { Profile } from "../../../../models/profile";
import ProfileDataView from "../../../../components/ProfileDataView/ProfileDataView";
import PersonDataView from "../../../../components/PersonDataView/PersonDataView";
import BackpackDataList from "../../../../components/BackpackDataList/BackpackDataList";
import StashDataList from "../../../../components/StashDataList/StashDataList";
import './ProfileData.less';

const { Title } = Typography;
const { TabPane } = Tabs;

type ProfileDataProps = {
  data?: [number, Person, Profile];
  onRefresh: (id: number) => void;
};

const ProfileData: FC<ProfileDataProps> = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const onRefreshCurrentProfile = useCallback(async () => {
    if (!data?.[0]) {
      return;
    }
    setLoading(true);
    try {
      await onRefresh(data[0]);
      message.success('数据已更新');
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [onRefresh, data]);

  if (!data) {
    return <div>未找到指定用户</div>;
  }
  return (
    <div className="table-modal-profile-data">
      <Title level={4} className="main-title">
        用户ID/名称: {data[0]} / {data[2].username}
        <Button loading={loading} onClick={onRefreshCurrentProfile}>重新获取</Button>
      </Title>
      <Tabs>
        <TabPane tab="Profile数据" key="1">
          <ProfileDataView profile={data[2]} />
        </TabPane>
        <TabPane tab="Person数据" key="2">
          <PersonDataView person={data[1]} />
        </TabPane>
        <TabPane tab="背包数据" key="3">
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
