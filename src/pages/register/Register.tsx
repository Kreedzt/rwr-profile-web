// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useState } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { LoginReq, RegisterReq } from "../../models/user";
import { useForm } from "antd/es/form/Form";
import { Link, RouteComponentProps, useNavigate } from "@reach/router";
import { UserService } from "../../services/user";
import { VERSION } from "../../constants";
import "./Register.less";

const { Title } = Typography;

const Register: FC<RouteComponentProps> = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const onFinish = useCallback(async (values: RegisterReq) => {
    const enhancedValues: RegisterReq = {
      ...values,
      // to base64
      password: window.btoa(values.password),
    };
    console.log("enhancedValues", enhancedValues);
    setSubmitLoading(true);

    try {
      const res = await UserService.register(enhancedValues);
      console.log("res", res);
      message.success("注册成功, 5秒后跳转到登录页");
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (e: any) {
      // message.error(e.message);
      console.log("e", e);
    }
    setSubmitLoading(false);
  }, []);

  const onFinishFailed = useCallback(() => {}, []);

  return (
    <div className="register-container">
      <div className="content">
        <Title level={4}>RWR存档管理系统 v{VERSION}</Title>
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
            <div className="register-comp button-area">
              <Button loading={submitLoading} type="primary" htmlType="submit">
                注册
              </Button>
              <Button>
                <Link to="/login">返回至登录页</Link>
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
