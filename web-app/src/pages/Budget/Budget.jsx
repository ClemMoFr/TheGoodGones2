import React, { useState } from "react";

import "./Budget.css";
import { Link } from "react-router-dom";

const Budget = () => {
  const [groupSelector, setGroupSelector] = useState(true);
  const [groupSelectorData, setGroupSelectorData] = useState("gg");

  function toggleGroup() {
    setGroupSelector(!groupSelector);
    const groupSelectorState = groupSelector === false ? "gg" : "mini-gg";
    setGroupSelectorData(groupSelectorState);
  }

  return (
    <div className="budgetMainContainer">
      <div className="budgetTop">
        <div className="budgetTopIcon"></div>
        <p className="budgetTopTitle">Budget</p>
      </div>
      <div className="budgetBottom">
        <Link to="epevc">Budget EPEVC</Link>
        <Link to="actes29">Budget Actes 29</Link>
        <Link to="evenements">Budget Évènements</Link>
      </div>
    </div>
  );
};

export default Budget;
