import React, { FC, useCallback, useState } from "react";
import QueryItemControl from "./QueryItemControl";
import { QueryItem, QueryModeEnum, QueryTypeEnum } from "./type";
import { Button, Select } from "antd";
import { PersonListItemMapper, QueryModeMapper } from "./mapper";

interface CustomQueryProps {
  onQuery: (q: QueryItem[], mode: QueryModeEnum) => void;
}

const queryModeOptions: Array<{
  label: string;
  value: string;
}> = Object.entries(QueryModeMapper).map(([v, k]) => {
  return {
    label: k,
    value: v,
  };
});

const CustomQuery: FC<CustomQueryProps> = ({ onQuery }) => {
  const [queryList, setQueryList] = useState<QueryItem[]>([]);
  const [queryMode, setQueryMode] = useState<QueryModeEnum>(QueryModeEnum.ONE);

  const onItemChange = useCallback((item: QueryItem) => {
    setQueryList((prev) => {
      return prev.map((q) => {
        if (q.id === item.id) {
          return item;
        }

        return q;
      });
    });
  }, []);

  const onRemoveItem = useCallback((item: QueryItem) => {
    setQueryList((prev) => {
      return prev.filter((q) => q.id !== item.id);
    });
  }, []);

  const onAddItem = useCallback(() => {
    setQueryList((prev) => {
      return [
        ...prev,
        {
          id: `${new Date().getTime()}`,
          key: "profile_id",
          value: undefined,
          label: PersonListItemMapper["profile_id"],
          type: QueryTypeEnum.EQUAL,
        },
      ];
    });
  }, []);

  const onCustomQuery = useCallback(() => {
    onQuery(queryList, queryMode);
  }, [queryList, queryMode, onQuery]);

  const onClear = useCallback(() => {
    setQueryList([]);
  }, []);

  return (
    <div>
      <p>自定义查询区域</p>
      <div>
        <Button onClick={onCustomQuery} type="primary">
          执行自定义查询
        </Button>
        <Button onClick={onClear} danger>
          清空自定义查询列表
        </Button>
        <Button onClick={onAddItem}>+</Button>
        <p>查询模式：</p>
        <Select
          placeholder="选择查询模式"
          value={queryMode}
          onChange={(e) => setQueryMode(e)}
          options={queryModeOptions}
        />
      </div>
      {queryList.map((q) => (
        <QueryItemControl
          key={q.id}
          record={q}
          onChange={onItemChange}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
};

export default CustomQuery;
