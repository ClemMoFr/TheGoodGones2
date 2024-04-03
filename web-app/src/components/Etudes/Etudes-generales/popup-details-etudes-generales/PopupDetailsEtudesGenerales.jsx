import React from "react";

import "./PopupDetailsEtudesGenerales.css";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupDetailsEtudesGenerales = ({
  etudeTitle,
  etudeTexte,
  etudeDescription,
  backArrowFunction,
}) => {
  return (
    <div className="popupDetailsEtudesGeneralesMainContainer">
      <BackArrow
        arrowPosition={"absolute"}
        xPosition={"30px"}
        yPosition={"-10px"}
        icon={"arrow"}
        backArrowFunction={backArrowFunction}
      />
      <p className="popupDetailsTitle">{etudeTitle}</p>
      <div className="etudeDescription">{etudeDescription}</div>
      <div className="popupDetailsTexte">{etudeTexte}</div>
    </div>
  );
};

export default PopupDetailsEtudesGenerales;
