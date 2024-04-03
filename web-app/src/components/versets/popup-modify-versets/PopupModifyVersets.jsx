import React, { useState } from "react";
import "./PopupModifyVersets.css";
import BackArrow from "../../back-arrow/BackArrow";

const PopupModifyVersets = ({
  versetsId,
  versetsModifyTitle,
  versetsModifyTexte,
  updateversets,
  backArrowFunction,
}) => {
  const [newTitle, setNewTitle] = useState(versetsModifyTitle);
  const [newTexte, setNewTexte] = useState(versetsModifyTexte);

  const handleUpdate = () => {
    updateversets(versetsId, newTitle, newTexte);
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
            un verset
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
            Numéro du verset
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </label>
        </div>

        <label>
          verset
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

export default PopupModifyVersets;
