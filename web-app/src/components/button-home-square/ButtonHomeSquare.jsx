import React from "react";

import "./ButtonHomeSquare.css";

const ButtonHomeSquare = ({ icon, buttonName }) => {
  return (
    <div className="buttonHomeSquareMainContainer">
      {icon}
      <p className="buttonHomeSquareName">{buttonName}</p>
    </div>
  );
};

export default ButtonHomeSquare;
