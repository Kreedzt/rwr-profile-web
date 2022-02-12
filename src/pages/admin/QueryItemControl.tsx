import React, { FC } from "react";
import { Select } from "antd";
import { QueryItem } from "./type";

interface QueryItemControlProps {
  record?: QueryItem;
  onChange: (q: QueryItem) => void;
}

const QueryItemControl: FC<QueryItemControlProps> = ({ record, onChange }) => {
  return <div>ID: {record?.id}</div>;
};

export default QueryItemControl;
