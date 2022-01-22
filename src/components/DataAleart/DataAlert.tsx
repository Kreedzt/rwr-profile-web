import React, { FC } from "react";
import { Alert } from "antd";

const DataAlert: FC = () => {
  return (
    <Alert
      message="警告"
      description="修改存档是一项有风险行为, 必须在rwr离线操作下进行"
      type="warning"
      showIcon
    />
  );
};

export default DataAlert;
