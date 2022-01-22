import React, { FC, useCallback, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Alert, Button } from "antd";
import { PersonService } from "../../services/person";
import StashList from "./List";
import { StashItem } from "../../models/person";
import EditableStashList from "./EditableList";
import DataAlert from "../../components/DataAleart/DataAlert";

type StashMode = "view" | "edit";

const StashModeMapper: Record<StashMode, string> = {
  view: "查看",
  edit: "编辑",
};

const Stash: FC<RouteComponentProps> = () => {
  const [queryBtnLoading, setQueryBtnLoading] = useState(false);
  const [stashList, setStashList] = useState<StashItem[]>([]);
  const [mode, setMode] = useState<StashMode>("view");

  const onQueryStash = useCallback(async () => {
    setQueryBtnLoading(true);
    try {
      const res = await PersonService.query();
      setStashList(res.stash_item_list);
      console.log("res", res);
    } catch (e) {
      console.log(e);
    }
    setQueryBtnLoading(false);
  }, []);

  const switchMode = useCallback(() => {
    setMode((prevMode) => {
      return prevMode === "view" ? "edit" : "view";
    });
  }, []);

  return (
    <div className="stash">
      <DataAlert />
      <Button onClick={onQueryStash} loading={queryBtnLoading}>
        点我获取存档信息
      </Button>
      <Button onClick={switchMode}>点我切换模式</Button>

      <p>当前模式: {StashModeMapper[mode]}</p>
      {mode === "view" && <StashList list={stashList} />}
      {mode === "edit" && <EditableStashList list={stashList} />}
    </div>
  );
};

export default Stash;
