import React, { useEffect } from "react";

import "./Etudes.css";
import { Link } from "react-router-dom";

import { FaChevronRight } from "react-icons/fa";

import { useAuth } from "../../firebase/AuthContext";
import PleaseLogin from "../../components/please-login/PleaseLogin";

const Etudes = () => {
  const { userData } = useAuth();

  if (!userData) {
    return <PleaseLogin />;
  }
  return (
    <div className="etudesMainContainer">
      <div className="etudesTop">
        <div className="etudesTopIcon"></div>
        <p className="etudesTopTitle">Etudes</p>
      </div>
      <div className="etudesBottom">
        {(userData.additionalInfo.status === "monos" ||
          userData.additionalInfo.status === "admin") && (
          <Link to="etudes-generales">
            <p className="etudesName">Etudes générales</p>
            <FaChevronRight
              style={{ position: "absolute", bottom: 20, right: 20 }}
              color="#C6253D"
            />
          </Link>
        )}

        <Link to="etudes-petits-groupes">
          <p className="etudesName">Etudes petits groupes</p>
          <FaChevronRight
            style={{ position: "absolute", bottom: 20, right: 20 }}
            color="#C6253D"
          />
        </Link>
      </div>
    </div>
  );
};

export default Etudes;
