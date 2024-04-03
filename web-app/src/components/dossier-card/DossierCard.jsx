import React from "react";

import "./DossierCard.css";

import { IoFileTrayFull } from "react-icons/io5";

const DossierCard = ({ haveButton, buttonTitle, memberName, filesOnDossier, seeFile, filesAvaible, onClickFunction }) => {
  return (
    <div className="dossierCardMainContainer">
      <IoFileTrayFull size={40} color="#1C2A4B" />
      <p>{memberName}</p>
      <p>{filesOnDossier} { seeFile ? "/" : ""} {filesAvaible} docs</p>

      {haveButton ? <button onClick={onClickFunction}>{buttonTitle}</button> : ""}
    </div>
  );
};

export default DossierCard;
