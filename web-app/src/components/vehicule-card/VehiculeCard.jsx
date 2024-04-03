import React from "react";

import "./VehiculeCard.css";

import { AiFillCar } from "react-icons/ai";
import { ImCross } from "react-icons/im";

const VehiculeCard = ({
  haveButton,
  haveErase,
  buttonTitle,
  driverName,
  bookedPlace,
  seeBookedPlace,
  nbrPlaceAvailable,
  onClickFunction,
  onClickRemoveVehicule,
}) => {
  return (
    <div className="vehiculeCardMainContainer">
      <AiFillCar size={40} color="#1C2A4B" />
      <p>{driverName}</p>
      <p>
        {bookedPlace} {seeBookedPlace ? "/" : ""} {nbrPlaceAvailable} places
      </p>

      {haveButton ? (
        <button onClick={onClickFunction}>{buttonTitle}</button>
      ) : (
        ""
      )}
      {haveErase && (
        <div className="cross" onClick={onClickRemoveVehicule}>
          <ImCross color="#c6253d" />
        </div>
      )}
    </div>
  );
};

export default VehiculeCard;
