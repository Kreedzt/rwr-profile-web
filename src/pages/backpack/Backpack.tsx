import React, { FC, useCallback, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Alert, Button } from "antd";
import { PersonService } from "../../services/person";
import ViewList from "./ViewList";
import { StashItem } from "../../models/person";
import DataAlert from "../../components/DataAleart/DataAlert";
import EditableBackpackList from "./EditableList";
import "./Backpack.less";

type BackpackMode = "view" | "edit";

const BackpackModeMapper: Record<BackpackMode, string> = {
  view: "查看",
  edit: "编辑",
};

const Backpack: FC<RouteComponentProps> = () => {
  const [queryBtnLoading, setQueryBtnLoading] = useState(false);
  const [backpackList, setBackpackList] = useState<StashItem[]>([]);
  const [backpackCapacity, setBackpackCapacity] = useState<number>(255);
  const [mode, setMode] = useState<BackpackMode>("view");

  const onQueryStash = useCallback(async () => {
    setQueryBtnLoading(true);
    try {
      const res = await PersonService.query();
      setBackpackList(res.backpack_item_list);
      setBackpackCapacity(res.backpack_hard_capacity);
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
    <div className="backpack">
      <DataAlert />
      <div className="backpack-control-area">
        <Button onClick={onQueryStash} loading={queryBtnLoading}>
          点我获取存档信息
        </Button>
        <Button onClick={switchMode} type="primary">
          点我切换模式
        </Button>
      </div>

      <div className="backpack-mode-area">
        <p>当前模式: {BackpackModeMapper[mode]}</p>
      </div>
      {mode === "view" && <ViewList list={backpackList} />}
      {mode === "edit" && <EditableBackpackList backpackCapacity={backpackCapacity} list={backpackList} />}
    </div>
  );
};

export default Backpack;
