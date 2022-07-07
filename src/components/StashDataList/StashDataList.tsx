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
  /**
   * 高亮索引列表:
   * @example [[0, 2], [4, 5]]
   */
  highLightRange: [number, number];
};

const transformStashDataToVisibleList = (
  stashDataList: StashItem[]
): VisibleListItem[] => {
  return stashDataList.map((s, index) => {
    return {
      ...s,
      id: `${s.index}-${index}`,
      highLightRange: [0, 0],
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
        return prev
          .filter((s) => {
            return s.key.includes(searchVal);
          })
          .map((item) => {
            const startIndex = item.key.indexOf(searchVal);
            const endIndex = startIndex + searchVal.length;

            return {
              ...item,
              highLightRange: [startIndex, endIndex],
            };
          });
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
        <div className="item-list">
          {visibleList.map((s) => (
            <div className="item-block" key={s.id}>
              <span className="item-segment">
                {searchVal ? (
                  <>
                    {s.key.slice(0, s.highLightRange[0])}
                    <span className="highlight">
                      {s.key.slice(s.highLightRange[0], s.highLightRange[1])}
                    </span>
                    {s.key.slice(s.highLightRange[1])}
                  </>
                ) : (
                  s.key
                )}
              </span>
              /<span className="item-segment">{s.index}</span>/
              <span className="item-segment">{s.class}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StashDataList;
