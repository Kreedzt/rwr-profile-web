// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useState } from "react";
import { message, Modal, Typography, Button, Input, Divider } from "antd";
import { ItemGroupTag, StashItem } from "../../../../models/person";
import { ModeEnum } from "../../enum";
import { PersonService } from "../../../../services/person";
import { PersonListItem } from "../../model";
import { ModeTextMapper } from "../../mapper";
import { parseEffectedCountText } from "../../util";
import QuickItems from "./QuickItems";

type ItemSendProps = {
  onGetMode: () => ModeEnum;
  onGetCheckedList: () => number[];
  onGetDisplayList: () => PersonListItem[];
};

const { Title } = Typography;

const ItemSend: FC<ItemSendProps> = ({
  onGetMode,
  onGetCheckedList,
  onGetDisplayList,
}) => {
  // 物品发放
  const [tempSendList, setTempSendList] = useState<StashItem[]>([]);
  const [code, setCode] = useState<string>();

  const insertTempItem = useCallback(async (c: StashItem) => {
    setTempSendList((prev) => [...prev, c]);
  }, []);

  const parseListToSubmitValue = useCallback(
    (list: StashItem[]): ItemGroupTag[] => {
      const keyCountMap = new Map<string, number>();
      const keyInfoMap = new Map<string, StashItem>();
      list.forEach((s) => {
        const countInMap = keyCountMap.get(s.key);

        keyCountMap.set(s.key, (countInMap ?? 0) + 1);
        keyInfoMap.set(s.key, s);
      });

      const resArr: ItemGroupTag[] = [];

      keyInfoMap.forEach((item, key) => {
        const resItem: ItemGroupTag = {
          key,
          class: item.class,
          index: item.index,
          amount: keyCountMap.get(key) as number,
        };

        resArr.push(resItem);
      });

      return resArr;
    },
    []
  );

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
          title: "准备添加如下内容到待发放区",
          content: (
            <div>
              <p>此操作不可逆, 请谨慎操作</p>
              <p>key: {parsedItem.key}</p>
              <p>index: {parsedItem.index}</p>
              <p>class: {parsedItem.class}</p>
            </div>
          ),
          onOk: async () => {
            return insertTempItem(parsedItem);
          },
        });
      } else {
        message.error("代码不合法!");
      }
    } catch (e) {
      message.error("代码内容不合法!");
      console.log("e", e);
    }
  }, [code, insertTempItem]);

  const onSubmitSend = useCallback(() => {
    const prettierMap = new Map<string, number>();
    tempSendList.forEach((t) => {
      const prettierItemCount = prettierMap.get(t.key);
      if (prettierItemCount !== undefined) {
        prettierMap.set(t.key, prettierItemCount + 1);
      } else {
        prettierMap.set(t.key, 1);
      }
    });

    const prettierList: Array<{
      label: string;
      count: number;
    }> = [];
    prettierMap.forEach((v, k) => {
      prettierList.push({
        label: k,
        count: v,
      });
    });

    const mode = onGetMode();
    const modeText = ModeTextMapper[mode];

    const checkedList = onGetCheckedList();
    const displayList = onGetDisplayList();
    const submitList = parseListToSubmitValue(tempSendList);

    Modal.confirm({
      title: `准备发放, 发放模式: ${modeText}`,
      content: (
        <div>
          <p
            style={{
              color: "#b00020",
            }}
          >
            影响范围: {parseEffectedCountText(mode, checkedList, displayList)}
          </p>
          <p>注意: 若某玩家的背包在发放后超出限制, 则会跳过该玩家</p>
          <Divider />
          <p>物品总数: {tempSendList.length}</p>
          <p>物品代码列表:</p>
          <code>
            <pre>{JSON.stringify(submitList)}</pre>
          </code>
          <p>物品优化展示列表(物品key: 数量):</p>
          {prettierList.map((prettierItem) => (
            <p key={prettierItem.label}>
              {prettierItem.label}: {prettierItem.count}
            </p>
          ))}
        </div>
      ),
      onOk: async () => {
        try {
          switch (mode) {
            case ModeEnum.ALL:
              await PersonService.insertAllPersonBackpack(submitList);
              break;
            case ModeEnum.LIST:
              {
                const profile_id_list =
                  displayList.map((d) => d.profile_id) ?? [];

                console.log("displayList: ", onGetDisplayList());

                await PersonService.batchInsertPersonBackpackList(
                  profile_id_list,
                    submitList
                );
              }
              break;
            case ModeEnum.CHECKED:
              {
                const profile_id_list = checkedList;

                console.log("checkedList: ", checkedList);
                await PersonService.batchInsertPersonBackpackList(
                  profile_id_list,
                    submitList
                );
              }
              break;
          }
          message.success(`发放物品成功`);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }, [
    tempSendList,
    onGetMode,
    onGetCheckedList,
    onGetDisplayList,
    parseListToSubmitValue,
  ]);

  return (
    <div>
      <Title level={4}>物品发放</Title>

      <div className="ready-to-send-area">
        <Title level={5}>待发放区</Title>
        <Button type="primary" onClick={onSubmitSend}>
          点我发放(待发放数量: {tempSendList.length})
        </Button>
        <Button danger onClick={() => setTempSendList([])}>
          清空待发放列表
        </Button>
      </div>

      <QuickItems onClickQuickItem={insertTempItem} />

      <div className="code-paste-area">
        <Title level={5}>代码粘贴区</Title>

        <Input.TextArea
          className="code-paste-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={"代码粘贴到此处"}
        />
        <Button onClick={onParseCode}>解析代码并添加</Button>
      </div>
    </div>
  );
};

export default ItemSend;
