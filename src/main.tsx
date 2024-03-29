// SPDX-License-Identifier: GPL-3.0-only
import React from "react";
import ReactDOM from "react-dom";
import localforage from "localforage";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import "./index.css";
import App from "./App";
import { LOCAL_FORAGE_CONFIG_KEY } from "./constants";

localforage.config({
  storeName: LOCAL_FORAGE_CONFIG_KEY,
});

dayjs.locale('zh-cn');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
