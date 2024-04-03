import React from "react";

import "./PopupAddEtudesGenerales.css";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupAddEtudesGenerales = ({
  valueEtudeGeneraleTitle,
  onChangeValueEtudeGeneraleTitle,
  valueEtudeGeneraleDescription,
  onChangeValueEtudeGeneraleDescription,
  valueEtudeGeneraleTexte,
  onChangeValueEtudeGeneraleTexte,
  addEtudeGenerale,
  backArrowFunction,
}) => {
  return (
    <form
      className="popupAddEtudesGeneralesMainContainer"
      onSubmit={addEtudeGenerale}
    >
      <div className="popupAddEtudesGenerales">
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
            titre de l’étude
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueEtudeGeneraleTitle}
              onChange={onChangeValueEtudeGeneraleTitle}
            ></input>
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Description de l’étude
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueEtudeGeneraleDescription}
              onChange={onChangeValueEtudeGeneraleDescription}
            ></input>
          </label>
        </div>
        <label>
          texte de l’étude
          <textarea
            style={{ width: "100%", marginTop: "10px" }}
            value={valueEtudeGeneraleTexte}
            onChange={onChangeValueEtudeGeneraleTexte}
          ></textarea>
        </label>

        <button type="submit">Ajouter</button>
      </div>
    </form>
  );
};

export default PopupAddEtudesGenerales;
