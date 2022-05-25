// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useState } from "react";
import { Radio } from "antd";
import { RouteComponentProps } from "@reach/router";
import PersonList, { usePersonListRef } from "./PersonList";
import { ModeEnum } from "./enum";
import { ModeTextMapper } from "./mapper";
import ControlNav from "./ControlNav";
import "./Admin.less";

const Admin: FC<RouteComponentProps> = () => {
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.ALL);
  const personListRef = usePersonListRef();

  const onGetMode = useCallback(() => {
    return mode;
  }, [mode]);

  const onGetDisplayList = useCallback(() => {
    return personListRef.current?.getDisplayList() ?? [];
  }, []);

  const onGetCheckedList = useCallback(() => {
    return personListRef.current?.getCheckedList() ?? [];
  }, []);

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

        <ControlNav
          onGetMode={onGetMode}
          onGetCheckedList={onGetCheckedList}
          onGetDisplayList={onGetDisplayList}
        />
      </div>

      <div className="person-list-area">
        <PersonList ref={personListRef} />
      </div>
    </div>
  );
};

export default Admin;
