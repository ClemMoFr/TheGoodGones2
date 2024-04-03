import React, { useEffect, useState } from "react";
import gg from "../../img/icon-gg-full-red.png";
import SpinnerComponent from "../Spinner-composant/SpinnerComponent";
import SplashScreen from "../../pages/SplashScreen/SplashScreen";

const PleaseLogin = () => {
  const [countdown, setCountdown] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const [connectionForm, setConnectionForm] = useState(false);

  useEffect(() => {
    const handleCountdown = () => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setConnectionForm(true);
      }
    };
    const intervalId = setInterval(handleCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);

  useEffect(() => {
    const timer = setTimeout(() => {}, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {isVisible && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            height: "70vh",
            width: "80%",
            margin: "auto",
            zIndex: "10",
          }}
        >
          <p style={{ fontSize: "1.6rem" }}>Erreur Authentification</p>
          <div
            style={{
              backgroundImage: `url(${gg})`,
              backgroundSize: "60%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "50%",
              aspectRatio: "4/3",
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0px 0px 30px 0px rgba(203, 228, 255, 0.60)",
            }}
          ></div>
          <p>
            Oops ! Une nouvelle connexion est requise. Tu vas être redirigé vers
            la page de connexion ...
          </p>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ position: "absolute" }}>{countdown}</p>
            <SpinnerComponent />
          </div>
        </div>
      )}
      {connectionForm && <SplashScreen />}
    </>
  );
};

export default PleaseLogin;
