// SPDX-License-Identifier: GPL-3.0-only
export interface PackageItem {
  slot: number;
  index: number;
  amount: number;
  key: string;
}

export interface StashItem {
  class: number;
  index: number;
  key: string;
}

export interface Person {
  max_authority_reached: number;
  authority: number;
  job_points: number;
  faction: string;
  name: string;
  version: string;
  alive: number;
  soldier_group_id: number;
  soldier_group_name: string;
  block: string;
  squad_size_setting: number;
  order: {
    moving: number;
    target: string;
    class: number;
  };
  // 1.92 新增: 背包容量
  backpack_hard_capacity: number;
  // 1.92 新增: 仓库容量
  stash_hard_capacity: number;
  item_list: PackageItem[];
  backpack_item_list: StashItem[];
  stash_item_list: StashItem[];
}

export interface SoliderGroupRes {
  error_profile_list: number[];
}
