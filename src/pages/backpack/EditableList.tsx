// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Input, List, message, Modal } from "antd";
import { ItemGroupTag, StashItem } from "../../models/person";
import { PersonService } from "../../services/person";
import { code_list } from "./code";
import "./EditableList.less";
import QuickItems from "../../components/QuickItems/QuickItems";

interface BackpackListProps {
  list: ItemGroupTag[];
  backpackCapacity: number;
}

const EditableBackpackList: FC<BackpackListProps> = ({
  list,
  backpackCapacity,
}) => {
  const [realList, setRealList] = useState<ItemGroupTag[]>(list);
  const [code, setCode] = useState<string>();

  useEffect(() => {
    setRealList(list);
  }, [list]);

  const onCopy = useCallback((targetItem: ItemGroupTag) => {
    setRealList((prev) => {
      return prev.map((prevItem) => {
        if (prevItem.key === targetItem.key) {
          return {
            ...prevItem,
            amount: prevItem.amount + 1,
          };
        }

        return prevItem;
      });
    });
  }, []);

  const onDelete = useCallback((index: number) => {
    setRealList((prev) => {
      return prev.filter((_a, i) => i !== index);
    });
  }, []);

  const onParseCode = useCallback(() => {
    if (!code) {
      message.error("代码内容为空!");
      return;
    }
    try {
      const parsedItem = JSON.parse(code) as ItemGroupTag;
      if (
        "key" in parsedItem &&
        "index" in parsedItem &&
        "class" in parsedItem
      ) {
        Modal.confirm({
          title: "准备添加如下内容",
          content: (
            <div>
              <p>key: {parsedItem.key}</p>
              <p>index: {parsedItem.index}</p>
              <p>class: {parsedItem.class}</p>
            </div>
          ),
          onOk: () => {
            setRealList((prev) => {
              return [...prev, parsedItem];
            });
          },
        });
      } else {
        message.error("代码不合法!");
      }
    } catch (e) {
      message.error("代码内容不合法!");
      console.log("e", e);
    }
  }, [code]);

  const onQuickAdd = useCallback(
    (c: StashItem) => {
      const backpackMap = new Map<string, ItemGroupTag>(
        realList.map((item) => [item.key, item])
      );

      const itemInMap = backpackMap.get(c.key);

      if (itemInMap) {
        itemInMap.amount += 1;
        backpackMap.set(itemInMap.key, itemInMap);
      } else {
        backpackMap.set(c.key, {
          ...c,
          amount: 1,
        });
      }

      const mapIter = backpackMap.values();

      const nextList: ItemGroupTag[] = [];
      for (const iterItem of mapIter) {
        nextList.push(iterItem);
      }

      setRealList(nextList);
    },
    [realList]
  );

  const onSave = useCallback(async () => {
    if (realList.length > backpackCapacity) {
      message.error("背包总数已超过上限");
      return;
    }
    Modal.confirm({
      title: "确认要覆写背包存档吗",
      content: "此操作不可逆,请谨慎操作",
      onOk: async () => {
        try {
          await PersonService.updateBackpackList(realList);
          message.success("写入成功!, 请重新获取背包列表");
        } catch (e) {
          console.log("e", e);
        }
      },
    });
  }, [realList, backpackCapacity]);

  return (
    <div className="backpack-comp editable-list">
      <div className="count-area">
        <p>
          当前总数:&nbsp;
          <span
            className={realList.length > backpackCapacity ? "error" : "normal"}
          >
            {realList.length}
          </span>
          /{backpackCapacity}
        </p>
      </div>

      <QuickItems onClickQuickItem={onQuickAdd} />

      <div className="code-paste-area">
        <p>代码粘贴区</p>
        <Input.TextArea
          className="code-paste-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={"代码粘贴到此处"}
        />
        <Button onClick={onParseCode}>解析代码并添加</Button>
      </div>

      <div className="content-area">
        <p>展示方式: key/index/class/amount</p>
        <Button type="primary" onClick={onSave}>
          保存并写入存档
        </Button>
        <List>
          {realList.map((item, index) => {
            return (
              <List.Item key={`${item.key}-${index}`}>
                {item.key} / {item.index} / {item.class} / {item.amount}
                <Button onClick={() => onCopy(item)}>追加复制</Button>
                <Button danger onClick={() => onDelete(index)}>
                  删除
                </Button>
              </List.Item>
            );
          })}
        </List>
      </div>
    </div>
  );
};

export default EditableBackpackList;
