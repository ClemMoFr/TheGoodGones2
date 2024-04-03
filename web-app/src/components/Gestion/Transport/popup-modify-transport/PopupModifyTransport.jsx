import React, { useState } from "react";
import "./PopupModifyTransport.css";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupModifyTransport = ({
  vehicle,
  updateVehicle,
  backArrowFunction,
  onDelete,
}) => {
  const [newVehicleOwner, setNewVehicleOwner] = useState(vehicle.vehicleOwner);
  const [newVehicleFreeSeat, setNewVehicleFreeSeat] = useState(
    vehicle.vehicleFreeSeat
  );

  const handleUpdate = () => {
    updateVehicle(newVehicleOwner, newVehicleFreeSeat);
  };

  const handleDelete = () => {
    onDelete();
  };

  const [messageDelete, setMessageDelete] = useState(false);

  return (
    <div className="popupModifyTransportMainContainer">
      {messageDelete ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "30px",
            margin: "auto",
            boxShadow: "0px 0px 30px 0px rgba(203, 228, 255, 0.6)",
          }}
        >
          <p>Confirmez la suppression de "{newVehicleOwner}" ?</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              fontSize: "1.4rem",
              marginTop: "30px",
            }}
          >
            <p
              onClick={handleDelete}
              style={{
                padding: "5px 20px",
                backgroundColor: "#c6253d",
                fontSize: "1.2rem",
                color: "white",
                borderRadius: "30px",
                border: "3px solid #c6253d",
              }}
            >
              oui
            </p>
            <p
              onClick={() => setMessageDelete(false)}
              style={{
                padding: "5px 20px",
                backgroundColor: "white",
                fontSize: "1.2rem",
                color: "#c6253d",
                borderRadius: "30px",
                border: "3px solid #c6253d",
              }}
            >
              non
            </p>
          </div>
        </div>
      ) : (
        <div>
          {" "}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              margin: "30px 0px",
            }}
          >
            <p className="popupAddTitleJeune">
              Modifier <br />
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
                value={newVehicleOwner}
                onChange={(e) => setNewVehicleOwner(e.target.value)}
                type="text"
                style={{ height: "30px" }}
              />
            </p>
            <p>
              Places disponibles{" "}
              <input
                value={newVehicleFreeSeat}
                onChange={(e) => setNewVehicleFreeSeat(e.target.value)}
                type="text"
                style={{ height: "30px" }}
              />
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",

                justifyContent: "space-around",
              }}
            >
              <button onClick={handleUpdate}>Modifier</button>
              <button type="button" onClick={() => setMessageDelete(true)}>
                Supprimer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PopupModifyTransport;
