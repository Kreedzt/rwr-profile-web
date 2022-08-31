// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useMemo } from "react";
import { Badge, Button, message, Modal, Popover } from "antd";
import dayjs from "dayjs";
import { StorageQueryItem } from "../../../../models/query";
import { MAX_QUERY_LIST_STORAGE } from "../../../../constants";
import "./StorageListHistory.less";

type StorageListHistoryProps = {
  storageList: StorageQueryItem[];
  storageCount: number;
  onUse: (data: StorageQueryItem["dataList"]) => void;
  onClear: () => Promise<void>;
  queryLoading: boolean;
};

const StorageListHistory: FC<StorageListHistoryProps> = ({
  storageList,
  storageCount,
  onUse,
  queryLoading,
  onClear,
}) => {
  const displayList = useMemo(() => {
    return storageList.reverse().map((s) => {
      return {
        data: s.dataList,
        time: dayjs.unix(s.timeStamp).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
  }, [storageList]);

  const onSelect = useCallback(
    (data: StorageQueryItem["dataList"]) => {
      if (queryLoading) {
        message.warn("数据获取期间请勿操作");
        return;
      }
      onUse(data);
      message.success("已更新表格数据");
    },
    [onUse, queryLoading]
  );

  const onClearAll = useCallback(() => {
    Modal.confirm({
      title: "清除全部历史数据",
      onOk: async () => {
        await onClear();
      },
    });
  }, []);

  return (
    <Popover
      trigger={["click"]}
      title={
        <div className="storage-list-history popover-title">
          <span>选择数据</span>
          <Button type="link" onClick={onClearAll}>
            清除全部
          </Button>
        </div>
      }
      content={
        <div className="storage-list-history popover-content">
          {displayList.map((d) => {
            return (
              <div className="data-item">
                <span className="time-desc">{d.time}的数据</span>
                <Button type="link" onClick={() => onSelect(d.data)}>使用</Button>
              </div>
            );
          })}
        </div>
      }
    >
      <Badge count={storageCount}>
        <Button loading={queryLoading}>
          使用历史查询数据(最大{MAX_QUERY_LIST_STORAGE}条)
        </Button>
      </Badge>
    </Popover>
  );
};

export default StorageListHistory;
