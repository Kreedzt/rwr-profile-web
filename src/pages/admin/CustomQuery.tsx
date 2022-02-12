import React, { FC, useCallback, useState } from "react";
import QueryItemControl from "./QueryItemControl";
import { QueryItem } from "./type";

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
      {queryList.map((q) => (
        <QueryItemControl key={q.id} record={q} onChange={onItemChange} />
      ))}
    </div>
  );
};

export default CustomQuery;
