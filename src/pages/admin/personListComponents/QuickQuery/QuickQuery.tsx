// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback } from "react";
import { Button, Typography } from "antd";
import { PersonListItem } from "../../model";

const { Title } = Typography;

type QueryCallback = (source: PersonListItem[]) => PersonListItem[];

type QuickQueryProps = {
  loading: boolean;
  onQuery: (filterCallback: QueryCallback) => void;
};

const QuickQuery: FC<QuickQueryProps> = ({ loading, onQuery }) => {
  const onQuery5Stars = useCallback(() => {
    onQuery((source) => source.filter((item) => item.xp > 10));
  }, [onQuery]);

  const onQueryUniqueBySid = useCallback(() => {
    onQuery((source) => {
      const tempMap = new Map<string, PersonListItem>();

      source.forEach((info) => {
        const tempMapRes = tempMap.get(info.sid);

        if (tempMapRes === undefined) {
          tempMap.set(info.sid, info);
          // 按游玩时间优先覆盖
        } else if (info.time_played > tempMapRes.time_played) {
          tempMap.set(info.sid, info);
        }
      });

      return Array.from(tempMap.values());
    });
  }, [onQuery]);

  const onQueryUniqueSquadBySid = useCallback(() => {
    onQuery((source) => {
      const tempMap = new Map<string, PersonListItem>();

      source.forEach((info) => {
        const tempMapRes = tempMap.get(info.sid);

        if (tempMapRes === undefined) {
          tempMap.set(info.sid, info);
          // 按游玩时间优先覆盖
        } else if (info.time_played > tempMapRes.time_played) {
          tempMap.set(info.sid, info);
        }
      });

      const resArr: PersonListItem[] = [];

      for (const item of tempMap.values()) {
        if (!!item.squad_tag) {
          resArr.push(item);
        }
      }

      return resArr;
    });
  }, [onQuery]);

  return (
    <div className="filter-area">
      <Title level={5}>二次快捷筛选区域(基于所有数据)</Title>
      <div className="btn-list">
        <Button loading={loading} onClick={onQuery5Stars}>
          过滤出所有五星人形
        </Button>
        <Button loading={loading} onClick={onQueryUniqueBySid}>
          按 sid 唯一过滤(游玩时间优先)
        </Button>
        <Button loading={loading} onClick={onQueryUniqueSquadBySid}>
          按 sid 唯一过滤且存在小队名称(游玩时间优先)
        </Button>
      </div>
    </div>
  );
};

export default QuickQuery;
