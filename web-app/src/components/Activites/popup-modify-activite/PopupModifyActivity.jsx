import React, { useEffect, useState } from "react";

import "./PopupModifyActivity.css";
import BackArrow from "../../back-arrow/BackArrow";

import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { get, ref } from "firebase/database";

const PopupModifyActivity = ({
  activitesId,
  updateActivity,
  backArrowFunction,
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuree, setNewDuree] = useState("");
  const [newType, setNewType] = useState("");
  const [newMin, setNewMin] = useState("");
  const [newMax, setNewMax] = useState("");
  const [newMateriel, setNewMateriel] = useState("");

  const { database } = FirebaseConfig();

  useEffect(() => {
    const activiteRef = ref(database, `activites/${activitesId}`);
    get(activiteRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const activityData = snapshot.val();
          setNewTitle(activityData.activitesTitle || "");
          setNewDescription(activityData.activitesDescription || "");
          setNewDuree(activityData.activitesDuree || "");
          setNewType(activityData.activitesType || "");
          setNewMin(activityData.activitesMin || "");
          setNewMax(activityData.activitesMax || "");
          setNewMateriel(activityData.activitesMateriel || "");
        } else {
          console.log("Aucune donnée trouvée pour ce jeune.");
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message
        );
      });
  }, [activitesId]);

  const handleUpdate = () => {
    updateActivity(
      activitesId,
      newTitle,
      newDescription,
      newDuree,
      newType,
      newMin,
      newMax,
      newMateriel
    );
  };

  return (
    <form className="popupModifyActiviteMainContainer">
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          margin: "10px 0px",
        }}
      >
        <p className="popupAddTitleJeune">
          Modifier <br />
          une activité
        </p>
        <BackArrow
          backArrowFunction={backArrowFunction}
          arrowPosition={"absolute"}
          xPosition={"0px"}
          yPosition={"0px"}
          icon={"arrow"}
        />
      </div>
      <div className="line">
        <label style={{ width: "50%", marginRight: "10px" }}>
          titre de l'activité
          <input
            style={{
              width: "100%",
              borderRadius: "10px",
              height: "50px",
              backgroundColor: "#e7f0ff",
              border: "none",
            }}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          ></input>
        </label>
        <label style={{ width: "50%" }}>
          type de jeux
          <div className="popupModifyProgrammSelectContainer">
            <select
              style={{
                width: "100%",
                borderRadius: "40px",
                height: "50px",
                backgroundColor: "#e7f0ff",
                border: "none",
                color: "#b5d6ff",
                fontSize: "1.2rem",
                paddingLeft: "20px",
              }}
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option>intérieur</option>
              <option>extérieur</option>
              <option>intérieur / extérieur</option>
            </select>
          </div>
        </label>
      </div>
      <div className="line">
        <label style={{ width: "60%", marginRight: "10px" }}>
          nombre de personnes
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            de{" "}
            <input
              style={{
                width: "30%",
                borderRadius: "10px",
                height: "50px",
                backgroundColor: "#e7f0ff",
                border: "none",
              }}
              value={newMin}
              onChange={(e) => setNewMin(e.target.value)}
            ></input>
            à{" "}
            <input
              style={{
                width: "30%",
                borderRadius: "10px",
                height: "50px",
                backgroundColor: "#e7f0ff",
                border: "none",
              }}
              value={newMax}
              onChange={(e) => setNewMax(e.target.value)}
            ></input>
          </div>
        </label>
        <label style={{ width: "50%" }}>
          Durée
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              style={{
                width: "100%",
                borderRadius: "10px",
                height: "50px",
                backgroundColor: "#e7f0ff",
                border: "none",
              }}
              value={newDuree}
              onChange={(e) => setNewDuree(e.target.value)}
            ></input>
            <p style={{ marginLeft: "10px" }}>minutes</p>
          </div>
        </label>
      </div>
      <label style={{ width: "100%" }}>
        Matériel
        <div className="popupModifyProgrammSelectContainer">
          <textarea
            style={{
              width: "100%",
              borderRadius: "10px",
              height: "10vh",
              backgroundColor: "#e7f0ff",
              border: "none",
            }}
            value={newMateriel}
            onChange={(e) => setNewMateriel(e.target.value)}
          ></textarea>
        </div>
      </label>
      <label style={{ width: "100%" }}>
        Description
        <div className="popupModifyProgrammSelectContainer">
          <textarea
            style={{
              width: "100%",
              borderRadius: "10px",
              height: "12vh",
              backgroundColor: "#e7f0ff",
              border: "none",
            }}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          ></textarea>
        </div>
      </label>
      <button onClick={handleUpdate}>Modifier</button>
    </form>
  );
};

export default PopupModifyActivity;
