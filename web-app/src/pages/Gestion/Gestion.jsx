import React, { useEffect } from "react";

import "./Gestion.css";
import { Link } from "react-router-dom";

import { FaCalendarDays } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { AiFillCar } from "react-icons/ai";
import { IoFileTrayFull } from "react-icons/io5";

import ButtonHomeSquare from "../../components/button-home-square/ButtonHomeSquare";
import ButtonHomeRectangle from "../../components/button-home-rectangle/ButtonHomeRectangle";
import { useAuth } from "../../firebase/AuthContext";

const Gestion = () => {
  const { userData } = useAuth();

  return (
    <>
      {userData &&
        userData.additionalInfo &&
        (userData.additionalInfo.status === "monos" ||
          userData.additionalInfo.status === "admin") && (
          <div className="gestionMainContainer">
            <div className="gestionTop">
              <div className="gestionTopIcon"></div>
              <p className="gestionTopTitle">Gestion</p>
            </div>
            <div className="gestionSquareButtonContainer">
              <div style={{ width: "100%", margin: "0 auto" }}>
                <Link to="programme">
                  <ButtonHomeRectangle
                    icon={<FaCalendarDays className="iconRectangle" />}
                    buttonName={"Programme"}
                  />
                </Link>
              </div>
              <div className="squareContainer">
                <Link to="contact">
                  <ButtonHomeSquare
                    icon={<BsFillTelephoneFill className="icon" />}
                    buttonName={"Contact"}
                  />
                </Link>
              </div>
              <div className="squareContainer">
                <Link to="transport">
                  <ButtonHomeSquare
                    icon={<AiFillCar className="icon" />}
                    buttonName={"Transport"}
                  />
                </Link>{" "}
              </div>
            </div>
            <div style={{ width: "90%", margin: "0 auto" }}>
              <Link to="dossier">
                <ButtonHomeRectangle
                  icon={<IoFileTrayFull className="iconRectangle" />}
                  buttonName={"Dossier"}
                />
              </Link>
            </div>
          </div>
        )}
      {userData.additionalInfo.status === "jeune" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "auto",
            width: "100%",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              width: "60%",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Ooops ! Il semblerait cette page n'existe pas !
          </h3>
          <Link to="/">
            <button
              style={{
                padding: "15px 30px",
                bordeRadius: "30px",
                border: "none",
                fontSize: "1rem",
                fontWeight: "700",
                backgroundColor: "#c6253d",
                color: "white",
                margin: "10px auto",
                borderRadius: "30px",
                cursor: "pointer",
              }}
            >
              retour à l'accueil
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Gestion;
