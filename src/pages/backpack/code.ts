// SPDX-License-Identifier: GPL-3.0-only
import { ItemGroupTag, StashItem } from "../../models/person";

export const code_list: Array<
  ItemGroupTag & {
    label: string;
  }
> = [
  {
    label: "CB1",
    key: "gift_box_community_1.carry_item",
    class: 3,
    index: 68,
    amount: 1,
  },
  {
    label: "CB2",
    key: "gift_box_community_2.carry_item",
    class: 3,
    index: 69,
    amount: 1,
  },
  {
    label: "黑卡",
    key: "gi_black_card.carry_item",
    class: 3,
    index: 74,
    amount: 1,
  },
  {
    label: "彩票",
    key: "lottery.carry_item",
    class: 3,
    index: 65,
    amount: 1,
  },
  {
    label: "白卡",
    key: "gi_contract_tdoll.carry_item",
    class: 3,
    index: 72,
    amount: 1,
  },
  {
    label: "Xmas Box",
    key: "xmas_box.carry_item",
    class: 3,
    index: 286,
    amount: 1,
  },
  {
    label: "New Year Box",
    key: "newyear_box.carry_item",
    class: 3,
    index: 62,
    amount: 1,
  },
  {
    label: "Play Box",
    key: "play_box.carry_item",
    class: 3,
    index: 61,
    amount: 1,
  },
  {
    label: "装备建造许可",
    key: "gi_contract_equip",
    class: 3,
    index: 73,
    amount: 1,
  },
];
