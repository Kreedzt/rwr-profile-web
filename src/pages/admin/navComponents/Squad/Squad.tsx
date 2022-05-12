import React, { FC, useCallback, useState } from "react";
import { Modal, Button, Typography, Input } from "antd";
import { ModeTextMapper } from "../../mapper";
import { ModeEnum } from "../../enum";
import { ProfileService } from "../../../../services/profile";
import { PersonListItem } from "../../model";

type SquadProps = {
  onGetMode: () => ModeEnum;
  onGetCheckedList: () => number[];
  onGetDisplayList: () => PersonListItem[];
};

const { Title } = Typography;

const Squad: FC<SquadProps> = ({
  onGetMode,
  onGetCheckedList,
  onGetDisplayList,
}) => {
  // 小队标签
  const [squadTagName, setSquadTagName] = useState<string>();

  const onSubmitSquadTag = useCallback(() => {
    const mode = onGetMode();
    Modal.confirm({
      title: `准备写入小队标签, 写入模式: ${ModeTextMapper[mode]}`,
      content: (
        <div>
          <p>更换小队标签为: {squadTagName}</p>
        </div>
      ),
      onOk: async () => {
        try {
          switch (mode) {
            case ModeEnum.ALL:
              await ProfileService.updateAllSquadTag(squadTagName ?? "");
              break;
            case ModeEnum.LIST: {
              const profile_id_list =
                onGetDisplayList().map((d) => d.profile_id) ?? [];

              await ProfileService.updateSelectedPersonSquadTag(
                profile_id_list,
                squadTagName ?? ""
              );
              break;
            }
            case ModeEnum.CHECKED: {
              const profile_id_list = onGetCheckedList();

              await ProfileService.updateSelectedPersonSquadTag(
                profile_id_list,
                squadTagName ?? ""
              );
              break;
            }
          }
        } catch (e) {
          console.log(e);
        }
      },
    });
  }, [squadTagName, onGetMode, onGetCheckedList, onGetDisplayList]);

  return (
    <div>
      <Title level={4}>小队管理</Title>

      <div className="ready-to-modify-squad-tag-area">
        <Title level={5}>
          更换小队标签为:
          <div>
            <Input
              value={squadTagName}
              placeholder="输入小队标签"
              onChange={(e) => setSquadTagName(e.target.value)}
            />
          </div>
        </Title>

        <Button type="primary" onClick={onSubmitSquadTag}>
          批量设置小队标签
        </Button>
      </div>
    </div>
  );
};

export default Squad;
