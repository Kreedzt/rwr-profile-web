// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useState } from "react";
import { StashItem } from "../../models/person";
import { Button, Input } from "antd";
import "./StashDataList.less";

type StashDataListProps = {
  stashDataList: StashItem[];
  max: number;
};

type VisibleListItem = StashItem & {
  id: string;
};

const transformStashDataToVisibleList = (
  stashDataList: StashItem[]
): VisibleListItem[] => {
  return stashDataList.map((s, index) => {
    return {
      ...s,
      id: `${s.index}-${index}`,
    };
  });
};

const StashDataList: FC<StashDataListProps> = ({ stashDataList, max }) => {
  const [searchVal, setSearchVal] = useState<string>();
  const [visibleList, setVisibleList] = useState<VisibleListItem[]>([]);

  const onUpdateVisibleList = useCallback((nextList: VisibleListItem[]) => {
    setVisibleList(nextList);
  }, []);

  const onSearch = useCallback(() => {
    setVisibleList((prev) => {
      if (searchVal) {
        return prev.filter((s) => s.key.includes(searchVal));
      }
      return prev;
    });
  }, [stashDataList, searchVal]);

  const onReset = useCallback(() => {
    onUpdateVisibleList(transformStashDataToVisibleList(stashDataList));
  }, [stashDataList]);

  useEffect(() => {
    onReset();
  }, [stashDataList]);

  return (
    <div className="stash-data-list">
      <div className="search-area">
        <Input
          placeholder="搜索key"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
        <Button type="primary" danger onClick={onReset}>
          重置
        </Button>
      </div>
      <div className="capacity">
        <p>
          总容量: {stashDataList.length} / {max}
        </p>
        <p>列表总数: {visibleList.length}</p>
      </div>
      <div className="content">
        <div className="header">
          <p>展示方式: key/index/class</p>
        </div>
        <div>
          {visibleList.map((s) => (
            <div key={s.id}>
              {s.key} / {s.index} / {s.class}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StashDataList;
