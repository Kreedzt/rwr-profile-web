import React, { FC, useCallback, useState } from "react";
import { Button, message, Modal } from "antd";
import { RouteComponentProps } from "@reach/router";
import DataAlert from "../../components/DataAleart/DataAlert";
import { PersonService } from "../../services/person";
import "./XP.less";

interface XPBtnItem {
  label: string;
  value: number;
}

const CUSTOM_XP_ITEM: XPBtnItem[] = [
  {
    label: "6星人形",
    value: 100.0,
  },
  {
    label: "1月人形",
    value: 200.0,
  },
  {
    label: "2月人形",
    value: 300.0,
  },
  {
    label: "3月人形",
    value: 400.0,
  },
  {
    label: "4月人形",
    value: 500.0,
  },
  {
    label: "5月人形",
    value: 750.0,
  },
  {
    label: "1日人形",
    value: 1000.0,
  },
];

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

  const onCustomReset = useCallback(async (x: XPBtnItem) => {
    Modal.confirm({
      title: `确认重置XP为${x.label}吗`,
      content: "此操作不可逆,请谨慎操作",
      onOk: async () => {
        try {
          await PersonService.resetXpCustom(x.value);
          message.success("操作成功");
        } catch (e) {
          console.log(e);
        }
      },
    });
  }, []);

  return (
    <div className="xp">
      <DataAlert />

      <div className="xp-info">
        <p>XP(数据可能不准确): {xp}</p>
        <Button loading={queryBtnLoading} onClick={onQueryXP}>
          获取XP信息
        </Button>
      </div>
      <div className="xp-control">
        <Button type="primary" onClick={onResetTo5Stars}>
          重置为5星人形
        </Button>
        {CUSTOM_XP_ITEM.map((x) => (
          <Button key={x.label} onClick={() => onCustomReset(x)}>
            重置为{x.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default XP;
