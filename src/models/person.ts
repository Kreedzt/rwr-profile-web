export interface PackageItem {
  slot: number;
  index: number;
  amount: number;
  key: string;
}

export interface StashItem {
  class: number,
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
  item_list: PackageItem[];
  stash_item_list: StashItem[];
}
