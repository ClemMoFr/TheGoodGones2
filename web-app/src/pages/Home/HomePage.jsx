import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../firebase/AuthContext";
import { get, ref } from "firebase/database";
import FirebaseConfig from "../../firebase/FirebaseConfig";

import { Link } from "react-router-dom";
import "./HomePage.css";

import { BsFilePersonFill } from "react-icons/bs";
import { FaBookBible } from "react-icons/fa6";
import { PiPiggyBankFill, PiHandsPrayingFill } from "react-icons/pi";
import { GrCluster } from "react-icons/gr";
import { GiSoccerKick } from "react-icons/gi";
import { FaCalendarDays } from "react-icons/fa6";
import { VscBook } from "react-icons/vsc";

import ButtonHomeRectangle from "../../components/button-home-rectangle/ButtonHomeRectangle";
import ButtonSquare from "../../components/button-home-square/ButtonHomeSquare";
import Notifications from "../../components/notification/Notifications";
import CryptoJS from "crypto-js";

const HomePage = () => {
  const { userData } = useAuth();
  const [notification, setNotification] = useState(false);
  const [decryptedFirstName, setDecryptedFirstName] = useState("");

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  useEffect(() => {
    if (
      userData &&
      userData.additionalInfo &&
      (userData.additionalInfo.jeuneFirstName ||
        userData.additionalInfo.monoFirstName)
    ) {
      const decryptedFirstName = CryptoJS.AES.decrypt(
        userData.additionalInfo.jeuneFirstName ||
          userData.additionalInfo.monoFirstName,
        commonPass
      ).toString(CryptoJS.enc.Utf8);
      setDecryptedFirstName(decryptedFirstName);
    }
  }, [userData, commonPass]);

  return (
    <div className="homePageMainContainer">
      {notification && <Notifications />}
      <div className="homePageIcon" />
      <p className="homePageMainWelcomeText">
        Bienvenue <br />
        {decryptedFirstName || ""}!
      </p>

      {userData.additionalInfo.status === "admin" && (
        <div>
          <div className="homePageSquareButtonContainer">
            <div className="squareContainer">
              <Link to="membres">
                <ButtonSquare
                  icon={<BsFilePersonFill className="icon" />}
                  buttonName={"Membres"}
                />
              </Link>
            </div>
            <div className="squareContainer">
              <Link to="etudes">
                <ButtonSquare
                  icon={<FaBookBible className="icon" />}
                  buttonName={"Études"}
                />
              </Link>
            </div>
            <div className="squareContainer">
              <Link to="budget">
                <ButtonSquare
                  icon={<PiPiggyBankFill className="icon" />}
                  buttonName={"Budget"}
                />
              </Link>
            </div>
            <div className="squareContainer">
              <Link to="gestion">
                <ButtonSquare
                  icon={<GrCluster className="icon" color="red" fill="red" />}
                  buttonName={"Gestion"}
                />
              </Link>
            </div>
          </div>
          <div>
            <Link to="activites">
              <ButtonHomeRectangle
                icon={<GiSoccerKick className="iconRectangle" />}
                buttonName={"Activités"}
              />
            </Link>
          </div>
        </div>
      )}

      {userData.additionalInfo.status === "monos" && (
        <div>
          <div
            className="homePageSquareButtonContainer"
            style={{ marginBottom: "20px" }}
          >
            <div className="squareContainer">
              <Link to="membres">
                <ButtonSquare
                  icon={<BsFilePersonFill className="icon" />}
                  buttonName={"Membres"}
                />
              </Link>
            </div>
            <div className="squareContainer">
              <Link to="etudes">
                <ButtonSquare
                  icon={<FaBookBible className="icon" />}
                  buttonName={"Études"}
                />
              </Link>
            </div>
            <div className="squareContainer">
              <Link to="activites">
                <ButtonSquare
                  icon={<GiSoccerKick className="icon" />}
                  buttonName={"Activités"}
                />
              </Link>
            </div>
            <div className="squareContainer">
              <Link to="gestion">
                <ButtonSquare
                  icon={<GrCluster className="icon" color="red" fill="red" />}
                  buttonName={"Gestion"}
                />
              </Link>
            </div>
          </div>
        </div>
      )}

      {userData.additionalInfo.status === "jeune" && (
        <div>
          <Link to="mes-etudes">
            <ButtonHomeRectangle
              icon={<FaBookBible className="iconRectangle" />}
              buttonName={"Études"}
            />
          </Link>
          <div className="homePageSquareButtonContainer">
            <div className="squareContainer">
              <Link to="mes-prieres">
                <ButtonSquare
                  icon={<PiHandsPrayingFill className="icon" />}
                  buttonName={"Prières"}
                />
              </Link>
            </div>
            <div className="squareContainer">
              <Link to="mes-versets-favoris">
                <ButtonSquare
                  icon={<VscBook className="icon" />}
                  buttonName={"Versets"}
                />
              </Link>
            </div>
          </div>
          <Link to="futurs-evenements">
            <ButtonHomeRectangle
              icon={<FaCalendarDays className="iconRectangle" />}
              buttonName={"Événements"}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
