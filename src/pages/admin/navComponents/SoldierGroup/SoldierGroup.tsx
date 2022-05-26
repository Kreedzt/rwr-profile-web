// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useState } from "react";
import { Button, Input, message, Modal, Typography, InputNumber } from "antd";
import { ModeTextMapper } from "../../mapper";
import { ModeEnum } from "../../enum";
import { PersonService } from "../../../../services/person";
import { PersonListItem } from "../../model";

const { Title } = Typography;

type SoldierGroupProps = {
  onGetMode: () => ModeEnum;
  onGetCheckedList: () => number[];
  onGetDisplayList: () => PersonListItem[];
};

const SoldierGroup: FC<SoldierGroupProps> = ({
  onGetMode,
  onGetCheckedList,
  onGetDisplayList,
}) => {
  // 改造兵种
  const [groupName, setGroupName] = useState<string>();
  const [groupCost, setGroupCost] = useState<number>(0);

  const onSubmitSoliderGroup = useCallback(() => {
    const mode = onGetMode();

    Modal.confirm({
      title: `准备批量改造, 改造模式: ${ModeTextMapper[mode]}`,
      content: (
        <div>
          <p>更换改造为: {groupName}</p>
          <p>消耗 RP 为: {groupCost}</p>
        </div>
      ),
      onOk: async () => {
        if (!groupName) {
          message.warn("请填写兵种名称!");
          return;
        }
        try {
          switch (mode) {
            case ModeEnum.ALL: {
              const res = await PersonService.updateAllSoldierGroup({
                group: groupName,
                cost: groupCost,
              });
              console.log("res:", res);

              const errorCount = res.error_profile_list.length;

              if (errorCount > 0) {
                message.success(
                  `操作成功, 有 ${errorCount} 个玩家存档操作失败`
                );
              } else {
                message.success("操作成功");
              }
              break;
            }

            case ModeEnum.LIST: {
              const profile_id_list =
                onGetDisplayList().map((d) => d.profile_id) ?? [];

              console.log("displayList: ", onGetDisplayList());

              const res = await PersonService.batchUpdateSoldierGroup(
                profile_id_list,
                {
                  group: groupName,
                  cost: groupCost,
                }
              );

              console.log("res:", res);

              const errorCount = res.error_profile_list.length;

              if (errorCount > 0) {
                message.success(
                  `操作成功, 有 ${errorCount} 个玩家存档操作失败`
                );
              } else {
                message.success("操作成功");
              }
              break;
            }
            case ModeEnum.CHECKED: {
              const profile_id_list = onGetCheckedList();
              console.log("checkedList: ", onGetCheckedList());

              const res = await PersonService.batchUpdateSoldierGroup(
                profile_id_list,
                {
                  group: groupName,
                  cost: groupCost,
                }
              );

              console.log("res:", res);

              const errorCount = res.error_profile_list.length;

              if (errorCount > 0) {
                message.success(
                  `操作成功, 有 ${errorCount} 个玩家存档操作失败`
                );
              } else {
                message.success("操作成功");
              }
              break;
            }
          }
        } catch (e) {
          console.log(e);
        }
      },
    });
  }, [groupName, groupCost, onGetMode, onGetCheckedList, onGetDisplayList]);

  return (
    <div>
      <Title level={4}>改造处理</Title>

      <div className="ready-to-modify-soldier-group-area">
        <Title level={5}>
          更换兵种为:
          <div>
            <Input
              value={groupName}
              placeholder="输入兵种类型(默认default)"
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </Title>
        <Title level={5}>
          待扣除的 RP 为:
          <InputNumber value={groupCost} onChange={setGroupCost} />
        </Title>
        <Button type="primary" onClick={onSubmitSoliderGroup}>
          批量改造
        </Button>
      </div>
    </div>
  );
};

export default SoldierGroup;
