import React from "react";

import { FaArrowLeftLong } from "react-icons/fa6";
import { ImCross } from "react-icons/im";

import "./BackArrow.css";

const BackArrow = ({
  icon,
  backArrowFunction,
  arrowPosition,
  xPosition,
  yPosition,
  color,
}) => {
  return (
    <>
      {icon === "arrow" ? (
        <FaArrowLeftLong
          style={{
            position: arrowPosition,
            right: xPosition,
            top: yPosition,
            fontSize: "30px",
            color: color,
          }}
          className="backArrow"
          onClick={backArrowFunction}
        />
      ) : (
        <ImCross
          style={{
            position: arrowPosition,
            right: xPosition,
            top: yPosition,
            fontSize: "20px",
            color: color,
          }}
          className="backArrow"
          onClick={backArrowFunction}
        />
      )}
    </>
  );
};

export default BackArrow;
