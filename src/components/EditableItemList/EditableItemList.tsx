// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, List, message, Modal } from "antd";
import { ItemGroupTag, StashItem } from "../../models/person";
import QuickItems from "../../components/QuickItems/QuickItems";
import './EditableItemList.less';

interface BackpackListProps {
  list: ItemGroupTag[];
  capacity: number;
  className?: string;
  saveProps: {
    title: string;
    content: string;
    successTip: string;
    onSave: (list: ItemGroupTag[]) => Promise<void>;
  };
}

const EditableBackpackList: FC<BackpackListProps> = ({
  className,
  list,
  capacity,
  saveProps,
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
        "class" in parsedItem &&
        "amount" in parsedItem
      ) {
        Modal.confirm({
          title: "准备添加如下内容",
          content: (
            <div>
              <p>key: {parsedItem.key}</p>
              <p>index: {parsedItem.index}</p>
              <p>class: {parsedItem.class}</p>
              <p>amount: {parsedItem.amount}</p>
            </div>
          ),
          onOk: () => {
            setRealList((prevRealList) => {
              const backpackMap = new Map<string, ItemGroupTag>(
                prevRealList.map((item) => [item.key, item])
              );

              const itemInMap = backpackMap.get(parsedItem.key);

              if (itemInMap) {
                itemInMap.amount += parsedItem.amount;
                backpackMap.set(itemInMap.key, itemInMap);
              } else {
                backpackMap.set(parsedItem.key, {
                  ...parsedItem,
                  amount: parsedItem.amount,
                });
              }

              const mapIter = backpackMap.values();

              const nextList: ItemGroupTag[] = [];
              for (const iterItem of mapIter) {
                nextList.push(iterItem);
              }
              return nextList;
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

  const count = useMemo<number>(() => {
    return realList.reduce((acc, item) => {
      acc += item.amount;
      return acc;
    }, 0);
  }, [realList]);

  const onSelfSave = useCallback(async () => {
    if (realList.length > capacity) {
      message.error("总数已超过上限");
      return;
    }
    Modal.confirm({
      title: saveProps.title,
      content: saveProps.content,
      onOk: async () => {
        try {
          await saveProps.onSave(realList);
          message.success(saveProps.successTip);
        } catch (e) {
          console.log("e", e);
        }
      },
    });
  }, [realList, capacity, saveProps]);

  const classNames = useMemo(() => {
    return `${className} editable-item-list`;
  }, [className]);

  return (
    <div className={classNames}>
      <div className="count-area">
        <p>
          当前总数(包含 amount 统计):&nbsp;
          <span className={count > capacity ? "error" : "normal"}>{count}</span>
          /{capacity}
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
        <Button type="primary" onClick={onSelfSave}>
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
