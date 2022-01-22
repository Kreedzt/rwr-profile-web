interface NavRouterItem {
  link: string;
  name: string;
}
export const navRouters: NavRouterItem[] = [
  {
    link: "stash",
    name: "仓库管理",
  },
  {
    link: "group",
    name: "改造管理",
  },
  {
    link: "xp",
    name: "经验管理",
  },
];
