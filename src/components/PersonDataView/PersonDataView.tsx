// SPDX-License-Identifier: GPL-3.0-only
import React, { FC } from "react";
import { Person } from "../../models/person";

type PersonDataViewProps = {
  person: Person;
};

const PersonDataView: FC<PersonDataViewProps> = ({ person }) => {
  return (
    <div>
      <div className="stat-block">
        <span>兵种：</span>
        <span>{person.soldier_group_name}</span>
      </div>
      <div className="stat-block">
        <span>XP：</span>
        <span>{person.max_authority_reached}</span>
      </div>
      <div className="stat-block">
        <span>RP：</span>
        <span>{person.job_points}</span>
      </div>
    </div>
  );
};

export default PersonDataView;
