import React from "react";

import "./Membres.css";
import { Link } from "react-router-dom";

const Membres = () => {
  return (
    <div className="membresMainContainer">
      <div className="membresTop">
        <div className="membresTopIcon"></div>
        <p className="membresTopTitle">Membres</p>
      </div>
      <div className="membresBottom">
        <Link to="jeunes">Jeunes</Link>
        <Link to="monos">Monos</Link>
        <Link to="petits-groupes">Petits Groupes</Link>
      </div>
    </div>
  );
};

export default Membres;
