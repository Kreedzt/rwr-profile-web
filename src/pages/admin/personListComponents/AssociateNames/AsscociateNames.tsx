import React, { FC } from "react";
import { Table } from "antd";
import { PERSON_LIST_COLUMNS } from "../../columns";
import { PersonListItem } from "../../model";

interface AsscociateNamesProps {
  personList: PersonListItem[];
}

const AssociateNames: FC<AsscociateNamesProps> = ({ personList }) => {
  return (
    <div>
      <Table
        rowKey="profile_id"
        dataSource={personList}
        columns={PERSON_LIST_COLUMNS}
      />
      当前表格内数据总数: {personList.length}
    </div>
  );
};

export default AssociateNames;
