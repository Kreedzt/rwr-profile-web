import React, { FC, useCallback, useState } from "react";
import QueryItemControl from "./QueryItemControl";
import { QueryItem } from "./type";
import { Button } from "antd";

interface CustomQueryProps {
  onQuery: (q: QueryItem[]) => void;
}

const CustomQuery: FC<CustomQueryProps> = () => {
  const [queryList, setQueryList] = useState<QueryItem[]>([]);

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

  return (
    <div>
      <p>自定义查询区域</p>
      <div>
        <Button type="primary">执行自定义查询</Button>
        <Button danger>重置自定义查询</Button>
        <Button>+</Button>
        <Button>-</Button>
      </div>
      {queryList.map((q) => (
        <QueryItemControl key={q.id} record={q} onChange={onItemChange} />
      ))}
    </div>
  );
};

export default CustomQuery;
