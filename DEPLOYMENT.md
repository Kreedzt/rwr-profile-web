# RWR 存档管理系统部署流程

该项目仅为前端, 部署时依赖后端, 后端部署见 [RWR存档管理服务](https://github.com/Kreedzt/rwr-profile-server)

## 部署方式

以下部署方式二选一即可

- 手动部署
- Docker 部署(若选择 Docker 部署, 服务端也需要选择 Docker 部署)

### 手动部署

#### 准备工作
> 手动部署需要一个 web 服务器来挂载, 如: NGINX
> 以下操作以 NGINX 为例

编写 nginx.conf 文件, 内容如下所示:

```conf
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location / {
            # 此处的目录需记住, 表明后面解压的目录
            root /dist;
            try_files $uri $uri/ /index.html;
            index index.html;
        }

        location /api/ {
            proxy_set_header HOST $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # 注意: 此处的 8080 表示后端启动时的 TCP 端口绑定为 8080, 视情况修改
            proxy_pass http://127.0.0.1:8080/;
        }
    }
}

```

复制一份本项目根目录的 `mime.types` 文件, 放置到与 `nginx.conf` 文件同位置

#### 启动 NGINX

进入 NGINX 目录, 使用如下命令读配置启动

```sh
# -c 后面跟上面编写的 nginx.conf 文件路径
nginx -c ../nginx.conf
```

#### 部署及更新

> 更新时无需重启 NGINX

将下载好的 [压缩包](https://github.com/Kreedzt/rwr-profile-web/releases) 解压到上述步骤的路径中即可

启动完成后, 通过 80 端口即可访问

### Docker 部署

暴露端口为 80

需要设置网络, 容器内变量为 `rwr-profile-server` (通过 --link 参数)

--link 参数使用说明:
```text
目标容器名称:本容器内变量
```

启动示例:
```sh
docker run --name rwr-profile-web-docker -p 9090:80 --link rwr-profile-server-docker:rwr-profile-server -d zhaozisong0/rwr-profile-web
```

以上表明已启动 `rwr-profile-server-docker` 容器名, 启动本容器时加入到 `rwr-profile-server-docker` 网络中

启动完成后, 通过映射的 9090 端口即可访问网页

更新时操作同上
