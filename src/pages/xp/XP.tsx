import React, { FC, useCallback, useState } from "react";
import { Button, message, Modal } from "antd";
import { RouteComponentProps } from "@reach/router";
import DataAlert from "../../components/DataAleart/DataAlert";
import { PersonService } from "../../services/person";

const XP: FC<RouteComponentProps> = () => {
  const [xp, setXp] = useState<number>();
  const [queryBtnLoading, setQueryBtnLoading] = useState(false);

  const onQueryXP = useCallback(async () => {
    setQueryBtnLoading(true);

    try {
      const res = await PersonService.query();
      setXp(res.authority);
    } catch (e) {
      console.log(e);
    }

    setQueryBtnLoading(false);
  }, []);

  const onResetTo5Stars = useCallback(async () => {
    Modal.confirm({
      title: "确认重置XP为5星人形吗",
      content: "此操作不可逆,请谨慎操作",
      onOk: async () => {
        try {
          await PersonService.resetXpTo5Stars();
          message.success("操作成功");
        } catch (e) {
          console.log(e);
        }
      },
    });
  }, []);

  return (
    <div>
      <DataAlert />

      <p>XP(数据可能不准确): {xp}</p>
      <Button loading={queryBtnLoading} onClick={onQueryXP}>
        获取XP信息
      </Button>
      <Button onClick={onResetTo5Stars}>重置为5星人形</Button>
    </div>
  );
};

export default XP;
