import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import FirebaseConfig from "../../firebase/FirebaseConfig";
import "./SplashScreen.css";
import BackArrow from "../../components/back-arrow/BackArrow";
import { v4 as uuidv4 } from "uuid";
import { ref, set } from "firebase/database";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SplashScreen = ({ onLogin, isLoggedIn }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [connexionPage, setConnexionPage] = useState(false);
  const [username, setUsername] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordDemandReinitialized, setPasswordDemandReinitialized] =
    useState(false);
  const [demandePasswordName, setDemandePasswordName] = useState("");
  const [demandePasswordSurname, setDemandePasswordSurname] = useState("");
  const [demandePasswordConnexionMail, setDemandePasswordConnexionMail] =
    useState("");
  const [demandePasswordMail, setDemandePasswordMail] = useState("");

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  const handleLoginSplashscreen = async () => {
    const { auth } = FirebaseConfig();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      onLogin();
    } catch (error) {
      console.error("Erreur de connexion :", error.message);
      setError("Erreur de connexion. Vérifiez vos identifiants.");
    }
  };

  const { database } = FirebaseConfig();

  const requestResetPassword = async (e) => {
    const { auth } = FirebaseConfig();
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      const demandeId = uuidv4();
      set(ref(database, `demandeReinitialisationMdp/${demandeId}`), {
        id: demandeId,
        demandeUserFirstName: demandePasswordName,
        demandeUserLastName: demandePasswordSurname,
        demandeUserMailConnexionMail: demandePasswordConnexionMail,
        demandeUserMail: demandePasswordMail,
      });

      await signOut(auth);
    } catch (error) {
      console.error("Erreur de connexion en tant qu'invité :", error.message);
      setError("Erreur de connexion en tant qu'invité. Veuillez réessayer.");
    }

    e.preventDefault();

    setPasswordDemandReinitialized(false);

    setDemandePasswordName("");
    setDemandePasswordSurname("");
    setDemandePasswordConnexionMail("");
    setDemandePasswordMail("");
  };

  function togglePassword() {
    setSeePassword(!seePassword);
  }

  return (
    <div className="splashScreenMainContainer">
      <div className={`splashScreen ${showSplash ? "show" : "hide"}`}></div>

      {passwordDemandReinitialized ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            top: "0",
            left: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "90%",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "50px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <BackArrow
              backArrowFunction={() => setPasswordDemandReinitialized(false)}
              arrowPosition={"absolute"}
              xPosition={"15px"}
              yPosition={"15px"}
              icon={"cross"}
            />
            <p
              style={{
                fontSize: "1.2rem",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Demande de réinitialisation <br />
              de mot de passe
            </p>
            <p
              style={{
                textAlign: "justify",
                marginBottom: "10px",
              }}
            >
              Remplis ce formulaire, ta demande seras transmise à un
              administrateur qui prendra en charge la réinitialisation de ton
              mot de passe.
            </p>
            <form>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "48%",
                  }}
                >
                  Prénom
                  <input
                    value={demandePasswordName}
                    onChange={(e) => setDemandePasswordName(e.target.value)}
                  ></input>
                </label>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "48%",
                  }}
                >
                  Nom
                  <input
                    value={demandePasswordSurname}
                    onChange={(e) => setDemandePasswordSurname(e.target.value)}
                  ></input>
                </label>
              </div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "20px",
                }}
              >
                Adresse mail
                <input
                  value={demandePasswordMail}
                  onChange={(e) => setDemandePasswordMail(e.target.value)}
                ></input>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "20px",
                }}
              >
                Nom d'utilisateur
                <input
                  value={demandePasswordConnexionMail}
                  onChange={(e) =>
                    setDemandePasswordConnexionMail(e.target.value)
                  }
                ></input>
              </label>
              <button
                type="button"
                style={{
                  margin: "auto",
                  display: "block",
                  padding: "15px 25px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  borderRadius: "30px",
                  border: "none",
                  color: "white",
                  backgroundColor: "#C6253D",
                }}
                onClick={(e) => requestResetPassword(e)}
              >
                Envoyer ma demande
              </button>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}

      {!isLoggedIn ? (
        <div className="splashScreenTroisieme">
          <div className="splashScreenLogoRed" />
          <form className="splashScreenForm">
            <p>Content de te voir !</p>
            <input
              placeholder="Nom d'utilisateur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ position: "relative" }}>
              <input
                placeholder="Mot de passe"
                type={seePassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                style={{
                  position: "absolute",
                  top: "32%",
                  right: "15px",
                }}
                onClick={() => togglePassword()}
              >
                {seePassword ? (
                  <FaRegEye size={25} color="#b5d6ff" />
                ) : (
                  <FaRegEyeSlash size={25} color="#b5d6ff" />
                )}
              </span>
            </div>

            <button type="button" onClick={handleLoginSplashscreen}>
              Connexion
            </button>
            <p
              style={{
                fontStyle: "normal",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => setPasswordDemandReinitialized(true)}
            >
              mot de passe oublié ?
            </p>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      ) : (
        <div className="splashScreenSecond">
          <div className="splashScreenLogoRed" />
          <div className="splashScreenVerset">
            <p>
              Que votre lumière luise ainsi devant les hommes, afin qu'ils
              voient vos bonnes oeuvres, et qu'ils glorifient votre Père qui est
              dans les cieux.
            </p>
            <p>- Matthieu 5:16</p>
          </div>
          <button type="button" onClick={() => setConnexionPage(true)}>
            Se connecter
          </button>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
