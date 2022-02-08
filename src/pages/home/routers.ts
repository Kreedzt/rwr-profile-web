interface NavRouterItem {
  link: string;
  name: string;
  admin: boolean;
}
export const navRouters: NavRouterItem[] = [
  {
    link: "backpack",
    name: "背包管理",
    admin: false,
  },
  {
    link: "stash",
    name: "仓库管理",
    admin: false,
  },
  {
    link: "group",
    name: "改造管理",
    admin: false,
  },
  {
    link: "xp",
    name: "经验管理",
    admin: false,
  },
  {
    link: "archive",
    name: "存档管理",
    admin: false,
  },
  {
    link: "admin",
    name: "管理员操作",
    admin: true,
  },
];
