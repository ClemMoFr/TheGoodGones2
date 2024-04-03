import React, { useEffect, useState } from "react";

import "./Transport.css";
import VehiculeCard from "../../../components/vehicule-card/VehiculeCard";
import PopupModifyTransport from "../../../components/Gestion/Transport/popup-modify-transport/PopupModifyTransport";
import PopupAddTransport from "../../../components/Gestion/Transport/popup-add-transport/PopupAddTransport";

import { ref, set, get, update, onValue, remove } from "firebase/database";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

const Transport = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [popupModifyTransport, setModifyTransport] = useState(false);
  const [popupAddTransport, setAddTransport] = useState(false);

  const [transport, setTransport] = useState([]);

  const { database } = FirebaseConfig();

  useEffect(() => {
    const dataRef = ref(database, `vehicules/`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setTransport(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setTransport([]);
      }
    });

    return () => unsubscribe();
  }, [database]);

  const handleModifyClick = (index) => {
    setSelectedVehicle(index);
    setModifyTransport(true);
  };

  const updateVehicle = (newVehicleOwner, newVehicleFreeSeat) => {
    const updatedTransports = [...transport];
    updatedTransports[selectedVehicle] = {
      ...updatedTransports[selectedVehicle],
      vehicleOwner: newVehicleOwner,
      vehicleFreeSeat: newVehicleFreeSeat,
    };

    const databaseRef = ref(
      database,
      `vehicules/${updatedTransports[selectedVehicle].id}`
    );

    try {
      update(databaseRef, {
        vehicleOwner: newVehicleOwner,
        vehicleFreeSeat: newVehicleFreeSeat,
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }

    setTransport(updatedTransports);
    setModifyTransport(false);
  };

  const handleDeleteClick = () => {
    const vehicleToDelete = transport[selectedVehicle];

    const databaseRef = ref(database, `vehicules/${vehicleToDelete.id}`);

    try {
      remove(databaseRef);
      const updatedTransports = [...transport];
      updatedTransports.splice(selectedVehicle, 1);

      setTransport(updatedTransports);
      setModifyTransport(false);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <div className="transportMainContainer">
      <div className="transportTop">
        <div className="transportTopIcon"></div>
        <p className="transportTopTitle">Gestion</p>
        <p className="transportTopSubtitle">Transport</p>
      </div>
      <div className="transportBottom">
        {popupModifyTransport && (
          <PopupModifyTransport
            vehicle={transport[selectedVehicle]}
            updateVehicle={updateVehicle}
            onDelete={() => handleDeleteClick(selectedVehicle)}
            backArrowFunction={() => setModifyTransport(false)}
          />
        )}
        {popupAddTransport && (
          <PopupAddTransport backArrowFunction={() => setAddTransport(false)} />
        )}
        <button
          className="transportBtnAddTransport"
          onClick={() => setAddTransport(true)}
        >
          Ajouter un véhicule
        </button>
        <p style={{ fontWeight: 600, fontSize: "1.2rem" }}>
          Tous les véhicules
        </p>
        <div className="transportCardMainContainer">
          {transport.map((transport, index) => (
            <VehiculeCard
              haveButton={true}
              buttonTitle={"Modifier"}
              seeBookedPlace={false}
              driverName={transport.vehicleOwner}
              nbrPlaceAvailable={transport.vehicleFreeSeat}
              onClickFunction={() => handleModifyClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transport;
