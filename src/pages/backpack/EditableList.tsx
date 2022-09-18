// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, List, message, Modal } from "antd";
import { ItemGroupTag, StashItem } from "../../models/person";
import { PersonService } from "../../services/person";
import { code_list } from "./code";
import "./EditableList.less";
import QuickItems from "../../components/QuickItems/QuickItems";
import EditableItemList from "../../components/EditableItemList/EditableItemList";

interface BackpackListProps {
  list: ItemGroupTag[];
  backpackCapacity: number;
}

const EditableBackpackList: FC<BackpackListProps> = ({
  list,
  backpackCapacity,
}) => {
  const onSave = useCallback(async (nextList: ItemGroupTag[]) => {
    await PersonService.updateBackpackList(nextList);
  }, []);

  const saveProps = useMemo(() => {
    return {
      title: "确认要覆写背包存档吗",
      content: "此操作不可逆,请谨慎操作",
      successTip: "写入成功!, 请重新获取背包列表",
      onSave,
    };
  }, [onSave]);

  return (
    <EditableItemList
      className="backpack-comp"
      list={list}
      capacity={backpackCapacity}
      saveProps={saveProps}
    />
  );
};

export default EditableBackpackList;
