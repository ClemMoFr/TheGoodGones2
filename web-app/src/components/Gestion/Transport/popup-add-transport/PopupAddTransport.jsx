import React, { useState } from "react";

import "./PopupAddTransport.css";
import FirebaseConfig from "../../../../firebase/FirebaseConfig";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

import BackArrow from "../../../back-arrow/BackArrow";

const PopupAddTransport = ({ onClose, backArrowFunction }) => {
  const [vehiculeData, setVehiculeData] = useState({
    vehicleOwner: "",
    vehicleFreeSeat: "",
  });

  const handleInputChange = (key, value) => {
    setVehiculeData({
      ...vehiculeData,
      [key]: value,
    });
  };

  const { database } = FirebaseConfig();

  const createVehicule = () => {
    const vehiculeId = uuidv4();
    set(ref(database, `vehicules/${vehiculeId}`), {
      id: vehiculeId,
      vehicleOwner: vehiculeData.vehicleOwner,
      vehicleFreeSeat: vehiculeData.vehicleFreeSeat,
    });
    backArrowFunction();
  };

  return (
    <div className="popupAddTransportMainContainer">
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          margin: "30px 0px",
        }}
      >
        <p className="popupAddTitleJeune">
          Ajouter <br />
          un véhicule
        </p>
        <BackArrow
          backArrowFunction={backArrowFunction}
          arrowPosition={"absolute"}
          xPosition={"0px"}
          yPosition={"0px"}
          icon={"arrow"}
        />
      </div>
      <form>
        <p>
          Véhicule de{" "}
          <input
            value={vehiculeData.vehicleOwner}
            onChange={(e) => handleInputChange("vehicleOwner", e.target.value)}
            type="text"
          />
        </p>
        <p>
          Places disponible{" "}
          <input
            value={vehiculeData.vehicleFreeSeat}
            onChange={(e) =>
              handleInputChange("vehicleFreeSeat", e.target.value)
            }
            type="text"
          />
        </p>
        <button type="button" onClick={createVehicule}>
          Créer
        </button>
      </form>
    </div>
  );
};

export default PopupAddTransport;
