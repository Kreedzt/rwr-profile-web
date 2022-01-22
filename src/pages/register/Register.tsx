import React, { FC, useCallback, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { LoginReq, RegisterReq } from "../../models/user";
import { useForm } from "antd/es/form/Form";
import { RouteComponentProps } from "@reach/router";
import { UserService } from "../../services/user";

const Register: FC<RouteComponentProps> = () => {
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
      setSubmitLoading(false);
    } catch (e: any) {
      setSubmitLoading(false);
      // message.error(e.message);
      console.log("e", e);
    }
  }, []);

  const onFinishFailed = useCallback(() => {}, []);

  return (
    <div>
      RWR存档管理系统
      <Form
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="username"
          required
          rules={[
            {
              required: true,
              message: "请输入用户名(与RWR规则一致全大写)",
            },
          ]}
          label="用户名"
        >
          <Input placeholder="请输入用户名(与RWR规则一致全大写)" />
        </Form.Item>
        <Form.Item name="password" required label="密码">
          <Input placeholder="请输入密码" type="password" />
        </Form.Item>
        <Form.Item>
          <Button loading={submitLoading} type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
