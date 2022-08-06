// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useState } from "react";
import { message, Modal, Typography, Button, Input, List, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ModeEnum } from "../../enum";
import { PersonService } from "../../../../services/person";
import { PersonListItem } from "../../model";
import { ModeTextMapper } from "../../mapper";
import "./ItemDelete.less";
import { parseEffectedCountText } from "../../parse";

const { Title } = Typography;

type ItemSendProps = {
  onGetMode: () => ModeEnum;
  onGetCheckedList: () => number[];
  onGetDisplayList: () => PersonListItem[];
};

const ItemDelete: FC<ItemSendProps> = ({
  onGetMode,
  onGetCheckedList,
  onGetDisplayList,
}) => {
  const [tempDeleteList, setTempDeleteList] = useState<string[]>([]);
  const [inputVal, setInput] = useState<string>("");

  const onAddItem = useCallback(() => {
    const trimedValue = inputVal.trim();

    if (trimedValue.length === 0) {
      message.warn("请填写 key 值");
      return;
    }

    if (tempDeleteList.includes(trimedValue)) {
      message.warn("已存在相同 key 值");
      return;
    }

    setTempDeleteList((prev) => [...prev, trimedValue]);
  }, [inputVal, tempDeleteList]);

  const onRemoveItem = useCallback((k: string) => {
    setTempDeleteList((prev) => prev.filter((p) => p !== k));
  }, []);

  const onSubmit = useCallback(() => {
    const mode = onGetMode();
    const modeText = ModeTextMapper[mode];

    const checkedList = onGetCheckedList();
    const displayList = onGetDisplayList();

    Modal.confirm({
      title: `准备删除, 操作模式: ${modeText}`,
      content: (
        <div>
          <p
            style={{
              color: "#b00020",
            }}
          >
            影响范围: {parseEffectedCountText(mode, checkedList, displayList)}
          </p>
          <p>物品总数: {tempDeleteList.length}</p>
          <p>物品代码列表:</p>
          {tempDeleteList.map((k) => (
            <p key={k}>{k}</p>
          ))}
        </div>
      ),
      onOk: async () => {
        try {
          switch (mode) {
            case ModeEnum.ALL:
              await PersonService.deleteAllItemList(tempDeleteList);
              break;
            case ModeEnum.LIST:
              {
                const profile_id_list =
                  displayList.map((d) => d.profile_id) ?? [];

                console.log("displayList: ", displayList);

                await PersonService.batchDeleteItemList(
                  profile_id_list,
                  tempDeleteList
                );
              }
              break;
            case ModeEnum.CHECKED:
              {
                const profile_id_list = checkedList;

                console.log("checkedList: ", checkedList);
                await PersonService.batchDeleteItemList(
                  profile_id_list,
                  tempDeleteList
                );
              }
              break;
          }
          message.success(`删除物品成功`);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }, [tempDeleteList, onGetMode, onGetCheckedList, onGetDisplayList]);

  return (
    <div className="item-delete-container">
      <Title level={4}>物品删除</Title>

      <Alert
        message="警告"
        description="物品删除是一项极具风险的行为, 建议处理前备份存档"
        type="warning"
        showIcon
      />

      <div className="ready-to-delete-area">
        <Title level={5}>待删除的 key 列表</Title>
      </div>

      <List
        className="delete-item-list"
        dataSource={tempDeleteList}
        bordered
        renderItem={(k) => (
          <List.Item
            key={k}
            actions={[
              <span onClick={() => onRemoveItem(k)}>
                <DeleteOutlined />
              </span>,
            ]}
          >
            {k}
          </List.Item>
        )}
      />

      <div className="insert-area">
        <Input
          value={inputVal}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入物品Key"
          suffix={
            <span>
              <Button type="default" onClick={onAddItem}>
                + 添加到列表
              </Button>
            </span>
          }
        />

        <div>
          <Button onClick={onSubmit} type="primary" danger>
            执行删除操作
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemDelete;
