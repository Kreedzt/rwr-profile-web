import React, { FC, useCallback } from "react";
import {
  RouteComponentProps,
  Router,
  Link,
  useNavigate,
  navigate,
} from "@reach/router";
import { Breadcrumb, Button, Layout, Menu } from "antd";
import { navRouters } from "./routers";
import Stash from "../stash/Stash";
import { VERSION } from "../../constants";
import { StorageService } from "../../services/storage";

const { Header, Content, Footer } = Layout;

const Home: FC<RouteComponentProps> = ({ children }) => {
  const navigate = useNavigate();

  const onQuit = useCallback(() => {
    StorageService.clearUserInfo();
      navigate("/login");
  }, []);

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          {navRouters.map((item) => {
            return (
              <Menu.Item key={item.link}>
                <Link to={`${item.link}`}>{item.name}</Link>
              </Menu.Item>
            );
          })}
          <Menu.Item>
            <Button danger onClick={onQuit}>
              退出登录
            </Button>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        RWR 存档管理系统, v: {VERSION}
      </Footer>
    </Layout>
  );
};

export default Home;
