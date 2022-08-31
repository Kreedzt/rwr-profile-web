// SPDX-License-Identifier: GPL-3.0-only
import React, { FC } from "react";
import { Button, Typography } from "antd";
import StorageListHistory from "./StorageListHistory";
import { StorageQueryItem } from "../../../../models/query";

const { Title } = Typography;

type MainQueryAreaProps = {
  queryLoading: boolean;
  onQueryAll: () => void;
  onClearQuery: () => void;
  storageList: StorageQueryItem[];
  storageCount: number;
  onUseStorage: (data: StorageQueryItem["dataList"]) => void;
  onClearStorage: () => Promise<void>;
};

const MainQueryArea: FC<MainQueryAreaProps> = ({
  queryLoading,
  onClearQuery,
  onQueryAll,
  storageCount,
  storageList,
  onUseStorage,
  onClearStorage,
}) => {
  return (
    <div className="main-area">
      <Title level={5}>查询区域</Title>
      <div className="btn-list">
        <Button loading={queryLoading} type="primary" onClick={onQueryAll}>
          查询全部(先点我查询)
        </Button>
        <Button loading={queryLoading} danger onClick={onClearQuery}>
          清空所有筛选
        </Button>
        <StorageListHistory
          storageList={storageList}
          storageCount={storageCount}
          onUse={onUseStorage}
          queryLoading={queryLoading}
          onClear={onClearStorage}
        />
      </div>
    </div>
  );
};

export default MainQueryArea;
