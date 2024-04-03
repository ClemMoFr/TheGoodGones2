import React from "react";

import "./PopupDetailsPrieres.css";
import BackArrow from "../../back-arrow/BackArrow";

const PopupDetailsPrieres = ({
  prieresTitle,
  prieresTexte,
  backArrowFunction,
}) => {
  return (
    <div className="popupDetailsPrieresMainContainer">
      <BackArrow
        arrowPosition={"absolute"}
        xPosition={"30px"}
        yPosition={"-10px"}
        icon={"arrow"}
        backArrowFunction={backArrowFunction}
      />
      <p className="popupDetailsTitle">{prieresTitle}</p>
      <div className="popupDetailsTexte">{prieresTexte}</div>
    </div>
  );
};

export default PopupDetailsPrieres;
