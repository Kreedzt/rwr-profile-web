import React, { FC } from "react";
import { StashItem } from "../../models/person";

type BackpackDataListProps = {
  backpackDataList: StashItem[];
  max: number;
};

const BackpackDataList: FC<BackpackDataListProps> = () => {
  return <div>BackpackDataList</div>;
};

export default BackpackDataList;
