import React, { FC, useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Alert, Button, Input, message, Upload } from "antd";
import DataAlert from "../../components/DataAleart/DataAlert";
import { PersonService } from "../../services/person";
import { ProfileService } from "../../services/profile";
import { UploadChangeParam } from "antd/es/upload";
import { StorageService } from "../../services/storage";
import "./Archive.css";

const Archive: FC<RouteComponentProps> = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [personUploadUrl, setPersonUploadUrl] = useState<string>();
  const [profileUploadUrl, setProfileUploadUrl] = useState<string>();
  const [alertPanel, setAlertPanel] = useState(true);
  const [targetUserName, setTargetUserName] = useState<string>();
  const [inputValue, setInputValue] = useState<string>();

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

  const onUploadPerson = useCallback((op: UploadChangeParam) => {
    const fileItem = op.fileList[0];
    console.log("op", op);
    if (fileItem?.status === "done") {
      message.success("上传并替换 .person 文件成功");
    } else if (fileItem?.status === "error") {
      message.error(
        `上传并替换 .person 文件失败: ${fileItem.response.message}`
      );
    }
  }, []);

  const onUploadProfile = useCallback((op: UploadChangeParam) => {
    const fileItem = op.fileList[0];
    console.log("op", op);
    if (fileItem?.status === "done") {
      message.success("上传并替换 .profile 文件成功");
    } else if (fileItem?.status === "error") {
      message.error(
        `上传并替换 .profile 文件失败: ${fileItem.response.message}`
      );
    }
  }, []);

  const getAllUploadUrl = useCallback(async () => {
    try {
      const [nextPersonUploadUrl, nextProfileUploadUrl] = await Promise.all([
        PersonService.getUploadUrl(),
        ProfileService.getUploadUrl(),
      ]);
      setPersonUploadUrl(nextPersonUploadUrl);
      setProfileUploadUrl(nextProfileUploadUrl);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getTargetUserName = useCallback(() => {
    const name = StorageService.getUserInfo()?.name;

    setTargetUserName(name);
  }, []);

  useEffect(() => {
    getAllUploadUrl();
    getTargetUserName();
  }, []);

  return (
    <div className="archive">
      <DataAlert />

      <div className="archive-info">
        <Button loading={btnLoading} type="primary" onClick={onDownloadPerson}>
          下载状态数据存档(.person)
        </Button>
        <Button loading={btnLoading} onClick={onDownloadProfile}>
          下载记录数据存档(.profile)
        </Button>
      </div>

      {alertPanel ? (
        <div className="alert-panel">
          <Alert
            message="警告"
            description="上传存档覆盖是一项极具风险行为，格式不对会导致炸服等情况发生，且上传时请以下载的文件名为准，不要修改文件名"
            type="warning"
            showIcon
          />
          <Alert
            message="警告"
            description="若你已了解风险，请在下方输入框输入你的用户名解锁该功能"
            type="warning"
            showIcon
          />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的登录用户名"
          />
          <Button
            disabled={targetUserName ? targetUserName !== inputValue : true}
            onClick={() => setAlertPanel(false)}
          >
            解锁上传功能
          </Button>
        </div>
      ) : (
        <div className="upload-info">
          <Upload
            accept=".person"
            action={personUploadUrl}
            onChange={onUploadPerson}
            maxCount={1}
          >
            <Button type="primary">上传状态数据存档(.person)</Button>
          </Upload>
          <Upload
            accept=".profile"
            action={profileUploadUrl}
            onChange={onUploadProfile}
            maxCount={1}
          >
            <Button danger>上传记录数据存档(.profile)</Button>
          </Upload>
        </div>
      )}
    </div>
  );
};

export default Archive;
