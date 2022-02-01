import React, { FC, useCallback, useState } from "react";
import { Button, message } from "antd";
import { RouteComponentProps } from "@reach/router";
import { code_list } from "./code_list";
import { StashItem } from "../../models/person";
import { PersonService } from "../../services/person";

const Admin: FC<RouteComponentProps> = () => {
  const [btnLoading, setBtnLoading] = useState(false);

  const updateAllPersonBackpack = useCallback(async (c: StashItem) => {
    setBtnLoading(true);

    try {
      await PersonService.insertAllPersonBackpack([c]);
      message.success(`发放 ${c.key} 成功`);
    } catch (e) {
      console.log(e);
    }

    setBtnLoading(false);
  }, []);

  return (
    <div className="admin">
      {code_list.map((c) => {
        const { label, ...stashInfo } = c;
        return (
          <Button
            key={c.key}
            loading={btnLoading}
            onClick={() => updateAllPersonBackpack(stashInfo)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default Admin;
