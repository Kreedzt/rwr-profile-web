import React, { FC, useCallback, useState } from "react";
import { Button, message, Input, Modal, Radio } from "antd";
import { RouteComponentProps } from "@reach/router";
import { code_list } from "./code_list";
import { StashItem } from "../../models/person";
import { PersonService } from "../../services/person";
import PersonList, { usePersonListRef } from "./PersonList";

enum ModeEnum {
  ALL = 0,
  LIST = 1,
  CHECKED = 2,
}

const Admin: FC<RouteComponentProps> = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.ALL);
  const [code, setCode] = useState<string>();
  const personListRef = usePersonListRef();

  const updateAllPersonBackpack = useCallback(
    async (c: StashItem) => {
      console.log("mode", mode);

      setBtnLoading(true);

      try {
        switch (mode) {
          case ModeEnum.ALL:
            await PersonService.insertAllPersonBackpack([c]);
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
                [c]
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
                [c]
              );
            }
            break;
        }
        message.success(`发放 ${c.key} 成功`);
      } catch (e) {
        console.log(e);
      }

      setBtnLoading(false);
    },
    [mode]
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
          title: "准备发放如下内容",
          content: (
            <div>
              <p>key: {parsedItem.key}</p>
              <p>index: {parsedItem.index}</p>
              <p>class: {parsedItem.class}</p>
            </div>
          ),
          onOk: async () => {
            try {
              switch (mode) {
                case ModeEnum.ALL:
                  await PersonService.insertAllPersonBackpack([parsedItem]);
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
                      [parsedItem]
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
                      [parsedItem]
                    );
                  }
                  break;
              }
              message.success(`发放 ${parsedItem.key} 成功`);
            } catch (e) {
              console.log(e);
            }
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

  return (
    <div className="admin">
      <div className="global-server-command">
        <p>物品发放</p>

        <div className="mode-switch">
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio value={ModeEnum.ALL}>全服发放</Radio>
            <Radio value={ModeEnum.LIST}>表格内数据发放</Radio>
            <Radio value={ModeEnum.CHECKED}>勾选发放</Radio>
          </Radio.Group>
        </div>

        <div className="quick-control-area">
          <p>快捷操作区(快速添加一项物品)</p>

          <div className="quick-btn-list">
            {code_list.map((c) => {
              const { label, ...stashInfo } = c;
              return (
                <Button
                  key={c.key}
                  loading={btnLoading}
                  onClick={() => updateAllPersonBackpack(stashInfo)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

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
      </div>

      <div className="person-list-area">
        <PersonList ref={personListRef} />
      </div>
    </div>
  );
};

export default Admin;
