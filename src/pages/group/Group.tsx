import React, { FC, useCallback, useState } from "react";
import DataAlert from "../../components/DataAleart/DataAlert";
import { RouteComponentProps } from "@reach/router";
import { Button, message, Modal, Select } from "antd";
import { PersonService } from "../../services/person";
import GroupReadme from "./GroupReadme";
import "./Group.less";

const groupTypeList: Array<{
  label: string;
  value: string;
}> = [
  {
    label: "无改造",
    value: "default",
  },
  {
    label: "TEL",
    value: "TEL",
  },
  {
    label: "TEL2",
    value: "TEL2",
  },
  {
    label: "SCT",
    value: "SCT",
  },
  {
    label: "SCT2",
    value: "SCT2",
  },
  {
    label: "SCT3",
    value: "SCT3",
  },
  {
    label: "GST",
    value: "GST",
  },
  {
    label: "GST2",
    value: "GST2",
  },
  {
    label: "GST3",
    value: "GST3",
  },
  {
    label: "HVY",
    value: "HVY",
  },
  {
    label: "HVY2",
    value: "HVY2",
  },
  {
    label: "HVY3",
    value: "HVY3",
  },
  {
    label: "MED",
    value: "MED",
  },
  {
    label: "PZC",
    value: "PZC",
  },
  {
    label: "ERC",
    value: "ERC",
  },
  {
    label: "ENG",
    value: "ENG",
  },
];

const Group: FC<RouteComponentProps> = () => {
  const [groupData, setGroupData] = useState<string>();
  const [queryBtnLoading, setQueryBtnLoading] = useState(false);
  const [nextGroupData, setNextGroupData] = useState<string>("default");

  const onQueryStash = useCallback(async () => {
    setQueryBtnLoading(true);
    try {
      const res = await PersonService.query();
      console.log("res", res);
      setGroupData(res.soldier_group_name);
    } catch (e) {
      console.log(e);
    }
    setQueryBtnLoading(false);
  }, []);

  const onSubmitGroup = useCallback(() => {
    Modal.confirm({
      title: "确认修改改造吗",
      content: `即将改造为:${nextGroupData}`,
      onOk: async () => {
        try {
          await PersonService.updateSoliderGroup(nextGroupData);
          message.success("操作成功");
        } catch (e) {
          console.log(e);
        }
      },
    });
  }, [nextGroupData]);

  return (
    <div className="soldier-group">
      <DataAlert />
      <div className="soldier-info">
        <p>当前改造(default为无改): {groupData}</p>
        <Button onClick={onQueryStash} loading={queryBtnLoading}>
          点我获取存档信息
        </Button>
      </div>

      <div className="soldier-control">
        <span>更换改造为:</span>
        <Select
          value={nextGroupData}
          onChange={setNextGroupData}
          options={groupTypeList}
        />
        <Button onClick={onSubmitGroup} type="primary">
          提交改造
        </Button>
      </div>

      <GroupReadme />
    </div>
  );
};

export default Group;
