import React, { FC, useCallback, useState } from "react";
import { Button, message, Input, Modal } from "antd";
import { RouteComponentProps } from "@reach/router";
import { code_list } from "./code_list";
import { StashItem } from "../../models/person";
import { PersonService } from "../../services/person";

const Admin: FC<RouteComponentProps> = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [code, setCode] = useState<string>();

  const updateAllPersonBackpack = useCallback(async (c: StashItem) => {
    setBtnLoading(true);

    try {
      await PersonService.insertAllPersonBackpack([c]);
      message.success(`发放 ${c.key} 成功`);
    } catch (e) {
      console.log(e);
    }

    setBtnLoading(false);
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
              await PersonService.insertAllPersonBackpack([parsedItem]);
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
        <p>全服发放</p>

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
    </div>
  );
};

export default Admin;
