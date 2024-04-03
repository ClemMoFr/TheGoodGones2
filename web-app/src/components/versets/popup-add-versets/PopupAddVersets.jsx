import React from "react";

import "./PopupAddVersets.css";
import BackArrow from "../../back-arrow/BackArrow";

const PopupAddVersets = ({
  valueVersetsTitle,
  onChangeValueVersetsTitle,
  valueVersetsTexte,
  onChangeValueVersetsTexte,
  addVersets,
  backArrowFunction,
}) => {
  return (
    <form className="popupAddVersetsMainContainer" onSubmit={addVersets}>
      <div className="popupAddVersets">
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
              value={valueVersetsTitle}
              onChange={onChangeValueVersetsTitle}
              placeholder="Ex : Jean 3:16"
            ></input>
          </label>
        </div>
        <label>
          verset
          <textarea
            style={{ width: "100%", marginTop: "10px" }}
            value={valueVersetsTexte}
            onChange={onChangeValueVersetsTexte}
          ></textarea>
        </label>

        <button type="submit">Ajouter</button>
      </div>
    </form>
  );
};

export default PopupAddVersets;
