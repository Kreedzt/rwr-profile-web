import { FC, useState } from "react";
import { Redirect, Router } from "@reach/router";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import "antd/dist/antd.css";
import "./App.css";
import Register from "./pages/register/Register";
import Stash from "./pages/stash/Stash";
import XP from "./pages/xp/XP";
import Group from "./pages/group/Group";

const App: FC = () => {
  return (
    <div className="app-container">
      <Router>
        <Login path="/login" />
        <Register path="/register" />
        <Home path="/">
          <Stash path="stash" />
          <XP path="xp" />
          <Group path="group" />
        </Home>
      </Router>
    </div>
  );
};

export default App;
