import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Input, List, message, Modal } from "antd";
import { StashItem } from "../../models/person";
import { PersonService } from "../../services/person";
import { code_list } from "./code";

interface StashListProps {
  list: StashItem[];
}

const EditableStashList: FC<StashListProps> = ({ list }) => {
  const [realList, setRealList] = useState<StashItem[]>(list);
  const [code, setCode] = useState<string>();

  useEffect(() => {
    setRealList(list);
  }, [list]);

  const onCopy = useCallback((item: StashItem) => {
    setRealList((prev) => {
      return [...prev, item];
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
      const parsedItem = JSON.parse(code) as StashItem;
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

  const onQuickAdd = useCallback((c: StashItem & { label: string }) => {
    const { label, ...newStash } = c;
    setRealList((prev) => [...prev, newStash]);
  }, []);

  const onSave = useCallback(async () => {
    if (realList.length > 300) {
      message.error("仓库总数已超过上限");
      return;
    }
    Modal.confirm({
      title: "确认要覆写仓库存档吗",
      content: "此操作不可逆,请谨慎操作",
      onOk: async () => {
        try {
          await PersonService.updateStashList(realList);
          message.success("写入成功!, 请重新获取仓库列表");
        } catch (e) {
          console.log("e", e);
        }
      },
    });
  }, [realList]);

  return (
    <div>
      <p>当前总数: {realList.length}/300</p>
      <div>
        <p>快捷操作区(快速添加一项物品)</p>
        {code_list.map((c) => {
          return (
            <Button key={c.key} onClick={() => onQuickAdd(c)}>
              {c.label}
            </Button>
          );
        })}
      </div>
      <div>
        代码粘贴区
        <Input.TextArea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={"代码粘贴到此处"}
        />
        <Button onClick={onParseCode}>解析代码并添加</Button>
      </div>
      <div>
        <p>展示方式: key/index/class</p>
        <Button type="primary" onClick={onSave}>
          保存并写入存档
        </Button>
      </div>
      <List>
        {realList.map((item, index) => {
          return (
            <List.Item key={`${item.key}-${index}`}>
              {item.key} / {item.index} / {item.class}
              <Button onClick={() => onCopy(item)}>追加复制</Button>
              <Button danger onClick={() => onDelete(index)}>
                删除
              </Button>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

export default EditableStashList;
