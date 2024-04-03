import React from "react";

import "./ActivityCard.css";

import { GiSoccerKick } from "react-icons/gi";
import { ImCross } from "react-icons/im";

const ActivityCard = ({
  haveErase,
  onClickRemoveActivity,
  haveButton,
  activityName,
}) => {
  return (
    <div className="activityCardMainContainer">
      <GiSoccerKick size={40} color="#1C2A4B" />
      <p>{activityName}</p>
      <p>1/3 places</p>

      {haveButton ? <button>Gérer</button> : ""}
      {haveErase && (
        <div className="cross" onClick={onClickRemoveActivity}>
          <ImCross color="#c6253d" />
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
