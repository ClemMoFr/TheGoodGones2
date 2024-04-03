import React, { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";

import CryptoJS from "crypto-js";

import "./Parametres.css";

import { PiTimerBold } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import BackArrow from "../../components/back-arrow/BackArrow";
import FirebaseConfig from "../../firebase/FirebaseConfig";

import { useAuth } from "../../firebase/AuthContext";

const Parametres = () => {
  const [reinitPassword, setReinitPassword] = useState(false);
  const [users, setUsers] = useState([]);

  const elem = document.documentElement;

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  const decryptField = (field) => {
    if (!field) return "";
    const bytes = CryptoJS.AES.decrypt(field, commonPass);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  function activerModePleinEcran() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari et Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // Internet Explorer
      elem.msRequestFullscreen();
    }
  }

  const [reinitPasswordData, setReinitPasswordData] = useState([]);

  const { database } = FirebaseConfig();

  useEffect(() => {
    const dataRef = ref(database, `demandeReinitialisationMdp`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setReinitPasswordData(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setReinitPasswordData([]);
      }
    });

    return () => unsubscribe();
  }, [database]);

  useEffect(() => {
    const snapshotJeunesGG = ref(database, `jeunes/gg`);
    const snapshotJeunesMiniGG = ref(database, `jeunes/mini-gg`);
    const snapshotMonosGG = ref(database, `monos/gg`);
    const snapshotMonosMiniGG = ref(database, `monos/mini-gg`);

    const fetchData = async () => {
      try {
        const dataJeunesGG = (await get(snapshotJeunesGG)).val() || {};
        const dataJeunesMiniGG = (await get(snapshotJeunesMiniGG)).val() || {};
        const dataMonosGG = (await get(snapshotMonosGG)).val() || {};
        const dataMonosMiniGG = (await get(snapshotMonosMiniGG)).val() || {};

        const dataArrayJeunesGG = Object.values(dataJeunesGG);
        const dataArrayJeunesMiniGG = Object.values(dataJeunesMiniGG);
        const dataArrayMonosGG = Object.values(dataMonosGG);
        const dataArrayMonosMiniGG = Object.values(dataMonosMiniGG);

        setUsers([
          ...dataArrayJeunesGG,
          ...dataArrayJeunesMiniGG,
          ...dataArrayMonosGG,
          ...dataArrayMonosMiniGG,
        ]);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error.message);
      }
    };
    fetchData();
  }, []);

  const { userData } = useAuth();

  const findUserStatusByEmail = (email) => {
    const matchingUser = users.find((user) => user.email === email);
    return matchingUser?.additionalInfo?.status || null;
  };

  return (
    <div className="gestionMainContainer">
      <div className="gestionTop">
        <div className="gestionTopIcon"></div>
        <p className="gestionTopTitle" style={{ textAlign: "center" }}>
          {reinitPassword
            ? "Demande de réinitialisation de mot de passe"
            : "Paramètres"}
        </p>
      </div>
      {reinitPassword ? (
        <>
          <BackArrow
            icon="arrow"
            backArrowFunction={() => setReinitPassword(false)}
            arrowPosition=""
            xPosition="20px"
            yPosition="190px"
          />
          <div
            style={{
              width: "100%",
              height: "60vh",
              marginTop: "50px",
              padding: "20px",
              overflowY: "scroll",
            }}
          >
            {reinitPasswordData.map((reinitPassword) => (
              <div
                key={reinitPassword.mail}
                style={{
                  width: "100%",
                  height: "145px",
                  borderRadius: "20px",
                  background: "#FFF",
                  boxShadow: "0px 0px 30px 0px rgba(203, 228, 255, 0.60)",
                  marginBottom: "20px",
                  padding: "20px",
                  position: "relative",
                }}
              >
                <PiTimerBold
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "20px",
                    fontSize: "1.8rem",
                    color: "#FFC61B",
                  }}
                />
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "1.4rem",
                  }}
                >
                  {reinitPassword.demandeUserFirstName}{" "}
                  {reinitPassword.demandeUserLastName}
                </p>
                <p
                  style={{
                    fontWeight: "400",
                    fontSize: "0.9rem",
                  }}
                >
                  Catégorie :{" "}
                  {findUserStatusByEmail(
                    reinitPassword.demandeUserMailConnexionMail
                  )}
                </p>
                <p
                  style={{
                    fontWeight: "400",
                    fontSize: "0.9rem",
                  }}
                >
                  mail : {reinitPassword.demandeUserMail}
                </p>
                <p
                  style={{
                    fontWeight: "400",
                    fontSize: "0.9rem",
                  }}
                >
                  mail appli : {reinitPassword.demandeUserMailConnexionMail}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            height: "60vh",
            marginTop: "30px",
          }}
        >
          <AiOutlineUser
            style={{ margin: "20px auto", width: "100%" }}
            size={70}
            color="#CBE4FF"
          />

          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            {(userData &&
              userData.additionalInfo &&
              decryptField(userData.additionalInfo.jeuneFirstName)) ||
              decryptField(userData.additionalInfo.monoFirstName)}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: "500",
            }}
          >
            {(userData &&
              userData.additionalInfo &&
              decryptField(userData.additionalInfo.email)) ||
              decryptField(userData.additionalInfo.email)}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              padding: "0px 10px",
              marginTop: "70px",
            }}
          >
            <button
              style={{
                backgroundColor: "#c6253d",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
                borderRadius: "30px",
                border: "none",
                width: "50%",
                margin: "auto",
                padding: "20px",
              }}
              onClick={activerModePleinEcran}
            >
              Activer le mode plein écran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parametres;
