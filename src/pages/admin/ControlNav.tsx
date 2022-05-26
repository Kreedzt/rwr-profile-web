// SPDX-License-Identifier: GPL-3.0-only
import React, { FC } from "react";
import { Tabs } from "antd";
import { ModeEnum } from "./enum";
import { PersonListItem } from "./model";
import ItemSend from "./navComponents/ItemSend/ItemSend";
import SoldierGroup from "./navComponents/SoldierGroup/SoldierGroup";
import Squad from "./navComponents/Squad/Squad";
import ItemDelete from "./navComponents/ItemDelete/ItemDelete";

const { TabPane } = Tabs;

interface ControlNavProps {
  onGetMode: () => ModeEnum;
  onGetCheckedList: () => number[];
  onGetDisplayList: () => PersonListItem[];
}

const ControlNav: FC<ControlNavProps> = (props) => {
  return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="物品发放" key="1">
                    <ItemSend {...props} />
                </TabPane>

                <TabPane tab="改造管理" key="2">
                    <SoldierGroup {...props} />
                </TabPane>

                <TabPane tab="物品删除" key="3">
                    <ItemDelete {...props} />
                </TabPane>

                <TabPane tab="小队管理(开发中)" key="4">
                    <Squad {...props} />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ControlNav;
