import React, { FC, useCallback, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Button } from "antd";
import DataAlert from "../../components/DataAleart/DataAlert";
import { PersonService } from "../../services/person";
import { ProfileService } from "../../services/profile";

const Archive: FC<RouteComponentProps> = () => {
  const [btnLoding, setBtnLoading] = useState(false);

  const onDownloadPerson = useCallback(async () => {
    setBtnLoading(true);

    try {
      const url = await PersonService.getDownloadUrl();

      window.open(url);
    } catch (e) {
      console.log(e);
    }
    setBtnLoading(false);
  }, []);

  const onDownloadProfile = useCallback(async () => {
    setBtnLoading(true);

    try {
      const url = await ProfileService.getDownloadUrl();

      window.open(url);
    } catch (e) {
      console.log(e);
    }

    setBtnLoading(false);
  }, []);

  return (
    <div className="archive">
      <DataAlert />

      <div className="archive-info">
        <Button loading={btnLoding} type="primary" onClick={onDownloadPerson}>
          下载状态数据存档(.person)
        </Button>
        <Button loading={btnLoding} onClick={onDownloadProfile}>
          下载信息数据存档(.profile)
        </Button>
      </div>
    </div>
  );
};

export default Archive;
