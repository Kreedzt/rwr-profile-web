import React, { FC } from "react";
import { Button, Input, Select } from "antd";
import { QueryItem } from "./type";
import { PersonListItem } from "./model";
import { PersonListItemMapper, QueryTypeMapper } from "./mapper";
import "./QueryItemControl.css";

interface QueryItemControlProps {
  record: QueryItem;
  onChange: (q: QueryItem) => void;
  onRemove: (q: QueryItem) => void;
}

const queryItemOptions: Array<{
  label: string;
  value: string;
}> = Object.entries(PersonListItemMapper).map(([v, k]) => {
  return {
    label: k,
    value: v,
  };
});

const queryTypeOptions: Array<{
  label: string;
  value: string;
}> = Object.entries(QueryTypeMapper).map(([v, k]) => {
  return {
    label: k,
    value: v,
  };
});

const QueryItemControl: FC<QueryItemControlProps> = ({
  record,
  onChange,
  onRemove,
}) => {
  return (
    <div className="query-item-control">
      <Button danger onClick={() => onRemove(record)}>- 移除此项</Button>
      <Select
        placeholder="选择查询目标"
        options={queryItemOptions}
        value={record.key}
        onChange={(e) => {
          onChange({
            ...record,
            key: e,
          });
        }}
      />
      <Select
        placeholder="选择运算符"
        value={record.type}
        options={queryTypeOptions}
        onChange={(e) => {
          onChange({
            ...record,
            type: e,
          });
        }}
      />
      <Input
        allowClear
        placeholder="输入查询内容"
        value={record.value}
        onChange={(e) =>
          onChange({
            ...record,
            value: e.target.value,
          })
        }
      />
    </div>
  );
};

export default QueryItemControl;
