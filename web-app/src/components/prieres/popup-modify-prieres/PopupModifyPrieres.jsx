import React, { useState } from "react";
import "./PopupModifyPrieres.css";
import BackArrow from "../../back-arrow/BackArrow";

const PopupModifyPrieres = ({
  prieresId,
  prieresModifyTitle,
  prieresModifyTexte,
  updateprieres,
  backArrowFunction,
}) => {
  const [newTitle, setNewTitle] = useState(prieresModifyTitle);
  const [newTexte, setNewTexte] = useState(prieresModifyTexte);

  const handleUpdate = () => {
    updateprieres(prieresId, newTitle, newTexte);
  };

  return (
    <form className="popupModifyPrieresMainContainer">
      <div className="popupModifyPrieres">
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
            une prière
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
            Titre de la prière
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </label>
        </div>

        <label>
          Texte de la prière
          <textarea
            style={{ width: "100%", marginTop: "10px" }}
            value={newTexte}
            onChange={(e) => setNewTexte(e.target.value)}
          />
        </label>

        <button type="button" onClick={handleUpdate}>
          Modifier
        </button>
      </div>
    </form>
  );
};

export default PopupModifyPrieres;
