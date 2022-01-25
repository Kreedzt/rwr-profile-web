import React, { FC, useCallback, useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { RouteComponentProps, Link, useNavigate } from "@reach/router";
import { LoginReq } from "../../models/user";
import { UserService } from "../../services/user";
import { StorageService } from "../../services/storage";
import { VERSION } from "../../constants";
import "./Login.css";

const { Title, Text } = Typography;

const Login: FC<RouteComponentProps> = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const onFinish = useCallback(async (values: LoginReq) => {
    const enhancedValues: LoginReq = {
      ...values,
      // to base64
      password: window.btoa(values.password),
    };
    console.log("enhancedValues", enhancedValues);
    setSubmitLoading(true);

    try {
      const res = await UserService.login(enhancedValues);
      StorageService.setUserInfo(res);
      console.log("res", res);
      setSubmitLoading(false);
      navigate("/");
    } catch (e: any) {
      setSubmitLoading(false);
      // message.error(e.message);
      console.error(e);
    }
  }, []);

  const onFinishFailed = useCallback(() => {}, []);

  return (
    <div className="login-container">
      <div className="content">
        <Title level={4}>RWR存档管理系统 v{VERSION}</Title>
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="username"
            required
            rules={[
              {
                required: true,
                message: "请输入用户名(必须与RWR名称一致且全大写)",
              },
            ]}
            label="用户名"
          >
            <Input placeholder="请输入用户名(必须与RWR名称一致且全大写)" />
          </Form.Item>
          <Form.Item
            name="password"
            required
            label="密码"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
          <Form.Item>
            <div className="login-comp button-area">
              <Button loading={submitLoading} type="primary" htmlType="submit">
                登录
              </Button>
              <Button>
                <Link to="/register">注册</Link>
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;
