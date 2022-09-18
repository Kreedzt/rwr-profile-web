// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, List, message, Modal } from "antd";
import { ItemGroupTag, StashItem } from "../../models/person";
import { PersonService } from "../../services/person";
import { code_list } from "./code";
import "./EditableList.less";
import QuickItems from "../../components/QuickItems/QuickItems";
import EditableItemList from "../../components/EditableItemList/EditableItemList";

interface StashListProps {
  list: ItemGroupTag[];
  stashCapacity: number;
}

const EditableStashList: FC<StashListProps> = ({ list, stashCapacity }) => {
  const onSave = useCallback(async (nextList: ItemGroupTag[]) => {
    await PersonService.updateStashList(nextList);
  }, []);

  const saveProps = useMemo(() => {
    return {
      title: "确认要覆写仓库存档吗",
      content: "此操作不可逆,请谨慎操作",
      successTip: "写入成功!, 请重新获取仓库列表",
      onSave,
    };
  }, [onSave]);

  return (
    <div className="stash-comp editable-list">
      <EditableItemList
        list={list}
        capacity={stashCapacity}
        saveProps={saveProps}
      />
    </div>
  );
};

export default EditableStashList;
