import React from "react";

import "./PopupAddPrieres.css";
import BackArrow from "../../back-arrow/BackArrow";

const PopupAddPrieres = ({
  valuePrieresTitle,
  onChangeValuePrieresTitle,
  valuePrieresTexte,
  onChangeValueprieresTexte,
  addPrieres,
  backArrowFunction,
}) => {
  return (
    <form className="popupAddPrieresMainContainer" onSubmit={addPrieres}>
      <div className="popupAddPrieres">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
          }}
        >
          <p className="popupAddTitleJeune">
            Ajouter <br />
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
            titre de la prière
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valuePrieresTitle}
              onChange={onChangeValuePrieresTitle}
            ></input>
          </label>
        </div>
        <label>
          prière
          <textarea
            style={{ width: "100%", marginTop: "10px" }}
            value={valuePrieresTexte}
            onChange={onChangeValueprieresTexte}
          ></textarea>
        </label>

        <button type="submit">Ajouter</button>
      </div>
    </form>
  );
};

export default PopupAddPrieres;
