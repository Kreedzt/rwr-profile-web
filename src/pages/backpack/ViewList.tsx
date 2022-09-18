// SPDX-License-Identifier: GPL-3.0-only
import React, { FC } from "react";
import { ItemGroupTag } from "../../models/person";
import ViewOnlyItemList from "../../components/ViewOnlyItemList/ViewOnlyItemList";
import "./ViewList.less";

interface StashListProps {
  list: ItemGroupTag[];
}

const ViewList: FC<StashListProps> = ({ list }) => {
  return <ViewOnlyItemList list={list} />;
};

export default ViewList;
