import React, { FC, useCallback, useState } from "react";
import {
  Button,
  message,
  Input,
  Modal,
  Radio,
  Typography,
  Tabs,
  InputNumber,
} from "antd";
import { RouteComponentProps } from "@reach/router";
import { code_list } from "./code_list";
import { StashItem } from "../../models/person";
import { PersonService } from "../../services/person";
import PersonList, { usePersonListRef } from "./PersonList";
import { ProfileService } from "../../services/profile";
import "./Admin.less";

enum ModeEnum {
  ALL = 0,
  LIST = 1,
  CHECKED = 2,
}

const ModeTextMapper: Record<ModeEnum, string> = {
  [ModeEnum.ALL]: "全服操作",
  [ModeEnum.LIST]: "表格内数据操作",
  [ModeEnum.CHECKED]: "勾选操作",
};

const { Title } = Typography;
const { TabPane } = Tabs;

const Admin: FC<RouteComponentProps> = () => {
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.ALL);
  const [code, setCode] = useState<string>();
  const personListRef = usePersonListRef();

  // 物品发放
  const [sendBtnLoading, setSendBtnLoading] = useState(false);
  const [tempSendList, setTempSendList] = useState<StashItem[]>([]);

  // 改造兵种
  const [soliderGroupBtnLoading, setSoliderGroupBtnLoading] = useState(false);
  const [groupName, setGroupName] = useState<string>();
  const [groupCost, setGroupCost] = useState<number>(0);

  // 小队标签
  const [squadTagName, setSquadTagName] = useState<string>();

  const insertTempItem = useCallback(async (c: StashItem) => {
    setTempSendList((prev) => [...prev, c]);
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

    Modal.confirm({
      title: `准备发放, 发放模式: ${ModeTextMapper[mode]}`,
      content: (
        <div>
          <p>物品总数: {tempSendList.length}</p>
          <p>物品代码列表:</p>
          <code>
            <pre>{JSON.stringify(tempSendList)}</pre>
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
              await PersonService.insertAllPersonBackpack(tempSendList);
              break;
            case ModeEnum.LIST:
              {
                const profile_id_list =
                  personListRef.current
                    ?.getDisplayList()
                    .map((d) => d.profile_id) ?? [];
                console.log(
                  "displayList: ",
                  personListRef.current?.getDisplayList()
                );
                await PersonService.batchInsertPersonBackpackList(
                  profile_id_list,
                  tempSendList
                );
              }
              break;
            case ModeEnum.CHECKED:
              {
                const profile_id_list =
                  personListRef.current?.getCheckedList() ?? [];
                console.log(
                  "checkedList: ",
                  personListRef.current?.getCheckedList()
                );
                await PersonService.batchInsertPersonBackpackList(
                  profile_id_list,
                  tempSendList
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
  }, [tempSendList, mode]);

  const onSubmitSoliderGroup = useCallback(() => {
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
                personListRef.current
                  ?.getDisplayList()
                  .map((d) => d.profile_id) ?? [];
              console.log(
                "displayList: ",
                personListRef.current?.getDisplayList()
              );

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
              const profile_id_list =
                personListRef.current?.getCheckedList() ?? [];
              console.log(
                "checkedList: ",
                personListRef.current?.getCheckedList()
              );

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
  }, [mode, groupName, groupCost]);

  const onSubmitSquadTag = useCallback(() => {
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
                personListRef.current
                  ?.getDisplayList()
                  .map((d) => d.profile_id) ?? [];

              await ProfileService.updateSelectedPersonSquadTag(
                profile_id_list,
                squadTagName ?? ""
              );
              break;
            }
            case ModeEnum.CHECKED: {
              const profile_id_list =
                personListRef.current?.getCheckedList() ?? [];

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
  }, [mode, squadTagName]);

  return (
    <div className="admin">
      <div className="global-server-command">
        <div className="mode-switch">
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio value={ModeEnum.ALL}>{ModeTextMapper[ModeEnum.ALL]}</Radio>
            <Radio value={ModeEnum.LIST}>{ModeTextMapper[ModeEnum.LIST]}</Radio>
            <Radio value={ModeEnum.CHECKED}>
              {ModeTextMapper[ModeEnum.CHECKED]}
            </Radio>
          </Radio.Group>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="物品发放" key="1">
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

              <div className="quick-control-area">
                <Title level={5}>快捷操作区(快速添加一项物品)</Title>

                <div className="quick-btn-list">
                  {code_list.map((c) => {
                    const { label, ...stashInfo } = c;
                    return (
                      <Button
                        key={c.key}
                        loading={sendBtnLoading}
                        onClick={() => insertTempItem(stashInfo)}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>

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
          </TabPane>

          <TabPane tab="改造管理" key="2">
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
                <Button
                  type="primary"
                  loading={soliderGroupBtnLoading}
                  onClick={onSubmitSoliderGroup}
                >
                  批量改造
                </Button>
              </div>
            </div>
          </TabPane>

          <TabPane tab="小队管理(开发中)" key="3">
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
          </TabPane>
        </Tabs>
      </div>

      <div className="person-list-area">
        <PersonList ref={personListRef} />
      </div>
    </div>
  );
};

export default Admin;
