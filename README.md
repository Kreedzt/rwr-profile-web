# RWR GFL 存档管理系统

## 快速上手

> 该项目依赖后端运行, 对应后端: https://github.com/Kreedzt/rwr-profile-server

下载本项目[构建后代码](https://github.com/Kreedzt/rwr-profile-web/releases)，然后下载后端[构建后代码](https://github.com/Kreedzt/rwr-profile-server/releases)，配合 nginx 托管，并放置 `config.json` 文件和 `users.json` 文件，最后启动后端及 nginx 即可

`config.json`(需要与该项目同目录):

```json5
{
  // rwr 存档目录，建议使用相对路径
  "rwr_profile_folder_path": "temp/profiles",
  // 服务器数据目录，不能为空，路径必须存在 users.json
  "server_data_folder_path": "temp/data",
  // 服务器日志目录
  "server_log_folder_path": "temp/logs",
  // 服务器上传存档临时目录，目标路径必须存在
  "server_upload_temp_folder_path": "temp/upload_temp"
}
```

`users.json`（需要放在 `config.json` 中设置的 `server_data_folder_path` 路径中）

> user_list 内容可以为空, 即为空数组也行, 第一次可以通过 web 页面注册用户, 然后手动修改 admin 标识

```json5
{
  "user_list": [
    {
      // 用户名
      "name": "AAA",
      // 对应的存档用户 id
      "user_id": 1432226718,
      // 密码(编码后)
      "password": "YWFh",
      // 是否管理员标识
      "admin": 1,
    },
  ],
}
```

## 成品展示

![预览图片](preview.png)

## 开发

> 该项目依赖后端运行, 具体请参考后端的开发操作: https://github.com/Kreedzt/rwr-profile-server

该项目依赖 [Nodejs](https://nodejs.org/en/) 进行开发

首先安装依赖包, 该项目采用 `pnpm` 进行包管理

安装 `pnpm` 命令:

```sh
npm i -g pnpm
```

安装依赖包:

```sh
pnpm i
```

启动开发环境

```sh
pnpm dev
```

启动后会在终端输出本地端口, 使用浏览器访问即可

## 构建

该项目依赖 [Nodejs](https://nodejs.org/en/) 进行打包操作

首先安装依赖包, 该项目采用 `pnpm` 进行包管理

安装 `pnpm` 命令:

```sh
npm i -g pnpm
```

安装依赖包:

```sh
pnpm i
```

构建

```sh
pnpm build
```

执行后会在 `dist` 目录下生成打包后代码

## 特性

- 用户登录注册
  - 提供基本的注册与登录
- 背包管理
  - 提供背包更新快捷操作与代码粘贴操作
- 仓库管理
  - 提供背包更新快捷操作与代码粘贴操作
- 改造管理
  - 改造更换
- 经验管理
  - 提供快速重置经验到 5 星人型
- 存档管理
  - 提供存档下载
  - 提供存档上传
- 管理员操作
  - 提供全服及指定玩家发放物品功能

## 协议

- [GPLv3](https://opensource.org/licenses/GPL-3.0)
