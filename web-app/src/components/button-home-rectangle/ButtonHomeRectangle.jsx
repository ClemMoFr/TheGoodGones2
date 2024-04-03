import React from "react";

import "./ButtonHomeRectangle.css";

const ButtonHomeRectangle = ({ icon, buttonName }) => {
  return (
    <div className="buttonHomeRectangleMainContainer">
      {icon}
      <p className="buttonHomeRectangleName">{buttonName}</p>
    </div>
  );
};

export default ButtonHomeRectangle;
