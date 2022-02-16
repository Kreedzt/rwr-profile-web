import { ColumnType } from "antd/es/table";
import { PersonListItem } from "./model";
import { PersonListItemMapper } from "./mapper";

export const PERSON_LIST_COLUMNS: ColumnType<PersonListItem>[] = [
  {
    dataIndex: "profile_id",
    key: "profile_id",
    title: PersonListItemMapper["profile_id"],
  },
  {
    dataIndex: "username",
    key: "username",
    title: PersonListItemMapper["username"],
  },
  {
    dataIndex: "xp",
    key: "xp",
    title: PersonListItemMapper["xp"],
    sorter: (a, b) => a.xp - b.xp,
  },
  {
    dataIndex: "rp",
    key: "rp",
    title: PersonListItemMapper["rp"],
    sorter: (a, b) => a.rp - b.rp,
  },
  {
    dataIndex: "time_played",
    key: "time_played",
    title: PersonListItemMapper["time_played"],
    sorter: (a, b) => a.time_played - b.time_played,
  },
  {
    dataIndex: "kills",
    key: "kills",
    title: PersonListItemMapper["kills"],
    sorter: (a, b) => a.kills - b.kills,
  },
  {
    dataIndex: "deaths",
    key: "deaths",
    title: PersonListItemMapper["deaths"],
    sorter: (a, b) => a.deaths - b.deaths,
  },
  {
    dataIndex: "player_kills",
    key: "player_kills",
    title: PersonListItemMapper["player_kills"],
    sorter: (a, b) => a.player_kills - b.player_kills,
  },
  {
    dataIndex: "squad_tag",
    key: "squad_tag",
    title: PersonListItemMapper["squad_tag"],
  },
  {
    dataIndex: "sid",
    key: "sid",
    title: PersonListItemMapper["sid"],
  },
  {
    dataIndex: "associated_count",
    key: "associated_count",
    title: PersonListItemMapper["associated_count"],
    sorter: (a, b) => a.associated_count - b.associated_count,
  },
];

export const getLinkablePersonListColumns = (
  onQueryAssociated: (sid: string) => void
) => {
  return PERSON_LIST_COLUMNS.map((c) => {
    if (c.key === "associated_count") {
      return {
        ...c,
        render: (value: number, record: PersonListItem, index: number) => {
          return (
            <a
              onClick={(e) => {
                e.preventDefault();
                onQueryAssociated(record.sid);
              }}
            >
              {value}
            </a>
          );
        },
      };
    }
    return c;
  });
};
