import React, { FC, useCallback } from "react";
import { Button, List, message, Table } from "antd";
import Clipboard from "react-clipboard.js";
import { StashItem } from "../../models/person";
import "./ViewList.less";

interface StashListProps {
  list: StashItem[];
}

const ViewList: FC<StashListProps> = ({ list }) => {
  const onCopy = useCallback(() => {
    message.success("复制成功");
  }, []);

  return (
    <div className="backpack-comp view-list">
      <div className="header">
        <p>展示方式: key/index/class</p>
      </div>
      <List className="content">
        {list.map((item, index) => {
          return (
            <List.Item key={`${item.key}-${index}`}>
              {item.key} / {item.index} / {item.class}
              <Clipboard
                component="a"
                data-clipboard-text={JSON.stringify(item)}
              >
                <Button onClick={onCopy}>复制代码(用于分享)</Button>
              </Clipboard>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

export default ViewList;
