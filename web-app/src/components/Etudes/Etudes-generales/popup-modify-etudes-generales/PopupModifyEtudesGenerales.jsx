import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../../firebase/FirebaseConfig";
import { get, ref } from "firebase/database";

import "./PopupModifyEtudesGenerales.css";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupModifyEtudesGenerales = ({
  etudeGeneraleId,
  groupSelectorData,
  updateEtudeGenerale,
  backArrowFunction,
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTexte, setNewTexte] = useState("");

  const { database } = FirebaseConfig();

  useEffect(() => {
    const etudeGeneraleRef = ref(
      database,
      `etudes/etudesGenerales/${groupSelectorData}/${etudeGeneraleId}`
    );

    get(etudeGeneraleRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const etudeGeneraleData = snapshot.val();
          setNewTitle(etudeGeneraleData.etudeGeneraleTitle || "");
          setNewDescription(etudeGeneraleData.etudeGeneraleDescription || "");
          setNewTexte(etudeGeneraleData.etudeGeneraleTexte || "");
        } else {
          console.log("Aucune donnée trouvée pour cette étude.");
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message
        );
      });
  }, [database, groupSelectorData, etudeGeneraleId]);

  const handleUpdate = () => {
    updateEtudeGenerale(etudeGeneraleId, newTitle, newDescription, newTexte);
  };

  return (
    <form className="popupModifyEtudesGeneralesMainContainer">
      <div className="popupModifyEtudesGenerales">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
          }}
        >
          <p className="popupAddTitleJeune">
            Modifier <br />
            une étude
          </p>
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"absolute"}
            xPosition={"0px"}
            yPosition={"0px"}
            icon={"arrow"}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Titre de l’étude
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            ></input>
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Description de l’étude
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            ></input>
          </label>
        </div>

        <label>
          Texte de l’étude
          <textarea
            style={{ width: "100%", marginTop: "10px" }}
            value={newTexte}
            onChange={(e) => setNewTexte(e.target.value)}
          ></textarea>
        </label>

        <button type="button" onClick={handleUpdate}>
          Modifier
        </button>
      </div>
    </form>
  );
};

export default PopupModifyEtudesGenerales;
