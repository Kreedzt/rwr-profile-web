import React, { FC, useCallback, useState } from "react";
import { Button, message, Input, Modal, Radio, Typography } from "antd";
import { RouteComponentProps } from "@reach/router";
import { code_list } from "./code_list";
import { StashItem } from "../../models/person";
import { PersonService } from "../../services/person";
import PersonList, { usePersonListRef } from "./PersonList";
import './Admin.less';

enum ModeEnum {
  ALL = 0,
  LIST = 1,
  CHECKED = 2,
}

const { Title } = Typography;

const Admin: FC<RouteComponentProps> = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.ALL);
  const [code, setCode] = useState<string>();
  const personListRef = usePersonListRef();
  const [tempSendList, setTempSendList] = useState<StashItem[]>([]);

  const insertTempItem = useCallback(async (c: StashItem) => {
    setTempSendList((prev) => [...prev, c]);
  }, []);

  const send = useCallback(() => {
    Modal.confirm({
      title: `准备发放, 发放模式: ${mode}`,
      content: (
        <div>
          <p>物品总数: {tempSendList.length}</p>
          <code>
            <pre>{JSON.stringify(tempSendList)}</pre>
          </code>
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
                await PersonService.insertSelectedPersonBackpackList(
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
                await PersonService.insertSelectedPersonBackpackList(
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

    setBtnLoading(false);
  }, [tempSendList, mode]);

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

  return (
    <div className="admin">
      <div className="global-server-command">
        <Title level={4}>物品发放</Title>

        <div className="mode-switch">
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio value={ModeEnum.ALL}>全服发放</Radio>
            <Radio value={ModeEnum.LIST}>表格内数据发放</Radio>
            <Radio value={ModeEnum.CHECKED}>勾选发放</Radio>
          </Radio.Group>
        </div>

        <div className="ready-to-send-area">
          <Title level={5}>待发放区</Title>
          <Button type="primary" onClick={send}>
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
                  loading={btnLoading}
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

      <div className="person-list-area">
        <PersonList ref={personListRef} />
      </div>
    </div>
  );
};

export default Admin;
