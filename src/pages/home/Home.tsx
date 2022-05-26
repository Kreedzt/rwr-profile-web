// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback } from "react";
import { RouteComponentProps, Link, useNavigate } from "@reach/router";
import { Dropdown, Layout, Menu } from "antd";
import { navRouters } from "./routers";
import {
  USER_ID_STORAGE_KEY,
  USER_NAME_STORAGE_KEY,
  VERSION,
} from "../../constants";
import { StorageService } from "../../services/storage";
import "./Home.less";

const { Header, Content, Footer } = Layout;

const Home: FC<RouteComponentProps> = ({ children }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem(USER_NAME_STORAGE_KEY);
  const userId = localStorage.getItem(USER_ID_STORAGE_KEY);

  const onQuit = useCallback(() => {
    StorageService.clearUserInfo();
    navigate("/login");
  }, []);

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div className="left-wrapper">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            {navRouters
              .filter((item) => {
                if (item.admin) {
                  if (StorageService.getUserInfo()?.admin !== 1) {
                    return false;
                  }
                }

                return true;
              })
              .map((item) => {
                return (
                  <Menu.Item key={item.link}>
                    <Link to={`${item.link}`}>{item.name}</Link>
                  </Menu.Item>
                );
              })}
          </Menu>
        </div>
        <div className="avatar">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="quit" onClick={onQuit}>
                  退出登录
                </Menu.Item>
              </Menu>
            }
          >
            <span>
              用户ID/名称: {userId}/{userName}
            </span>
          </Dropdown>
        </div>
      </Header>
      <Content className="home-content" style={{ padding: "0 50px" }}>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer className="home-footer" style={{ textAlign: "center" }}>
        RWR 存档管理系统, v: {VERSION}
      </Footer>
    </Layout>
  );
};

export default Home;
