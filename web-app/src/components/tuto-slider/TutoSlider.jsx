import React, { useState } from "react";
import { BsArrowRight, BsArrowsFullscreen } from "react-icons/bs";
import { useAuth } from "../../firebase/AuthContext";
import "./TutoSlider.css";

const TutoSlider = ({ handleClose }) => {
  const [slide, setSlide] = useState("step1");
  const [fullscreenActivated, setFullscreenActivated] = useState(false);
  const { userData } = useAuth();

  function increment() {
    const [fixedPart, currentNumber] = slide.split("step");
    let newNumber = Number(currentNumber) + 1;

    if (newNumber > 5) {
      newNumber = 1;
    }

    setSlide(fixedPart + "step" + newNumber);
  }

  const elem = document.documentElement;
  function activerModePleinEcranTuto() {
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
    setFullscreenActivated(true);
  }

  let backgroundClassParameter;
  if (userData.additionalInfo.status === "admin") {
    backgroundClassParameter = "backgroundClassParameter-1";
  } else if (userData.additionalInfo.status === "mono") {
    backgroundClassParameter = "backgroundClassParameter-2";
  } else {
    backgroundClassParameter = "backgroundClassParameter-3";
  }

  let backgroundClassFonctionnality;
  if (userData.additionalInfo.status === "admin") {
    backgroundClassFonctionnality = "backgroundClassFonctionnality-1";
  } else if (userData.additionalInfo.status === "mono") {
    backgroundClassFonctionnality = "backgroundClassFonctionnality-2";
  } else {
    backgroundClassFonctionnality = "backgroundClassFonctionnality-3";
  }

  return (
    <div className="tutoMainContainer">
      <div className="popupMainContainer">
        <div className="topSLiderHelp">
          {slide === "step1" && <div className="logo" />}
          {slide === "step2" && (
            <div className="pulse-element-main-container">
              <div className="pulse-element"></div>
              <BsArrowsFullscreen
                onClick={activerModePleinEcranTuto}
                className="picto"
              />
            </div>
          )}
          {slide === "step3" && <div className={backgroundClassParameter} />}
          {slide === "step4" && (
            <div className={backgroundClassFonctionnality} />
          )}
        </div>
        <div className="titleSLiderHelp">
          <p>
            {slide === "step1" && "Bienvenue !"}
            {slide === "step2" && "Mode plein écran"}
            {slide === "step3" && "Réactiver le mode plein écran"}
            {slide === "step4" && "Fonctionnalités"}
            {slide === "step5" && (
              <button className="btn-lets-go" onClick={handleClose}>
                C'est parti !
              </button>
            )}
          </p>
        </div>
        <div className="descriptionSLiderHelp">
          <p style={{ whiteSpace: "pre-line", textAlign: "justify" }}>
            {slide === "step1" &&
              "Voici quelques explications pour bien démarrer !"}
            {slide === "step2" &&
              "La première chose à faire est d’activer le mode plein écran en appuyant sur le bouton ci-dessus."}
            {slide === "step3" &&
              "En cas de perte du mode plein écran, se rendre dans les paramètres pour le réactiver."}
            {slide === "step4" &&
              userData.additionalInfo.status === "admin" &&
              "L’application des GG est divisée en cinq parties principales : \n\n1) Membres : Gérer les membres de l’application \n\n2) Etudes : Créer et sauvegarder des études. \n\n3) Budget : Gérer le budget des différents événements \n\n4) Gestion : Gérer le programme, les présences, les contacts, les moyens de transports et les dossiers. \n\n5) Activités : Gérer les activités qui pourront être proposées"}
            {slide === "step4" &&
              userData.additionalInfo.status === "mono" &&
              "L’application des GG est divisée en quatre parties principales : \n\n1) Membres : Gérer les membres de l’application \n\n2) Etudes : Créer et sauvegarder des études. \n\n3) Gestion : Gérer le programme, les présences, les contacts, les moyens de transports et les dossiers. \n\n4) Activités : Gérer les activités qui pourront être proposées."}
            {slide === "step4" &&
              userData.additionalInfo.status === "jeune" &&
              "L’application des GG est divisée en quatre parties principales : \n\n1) Etudes : C'est ici que tu vas pouvoir suivre les études réalisées par les moniteurs. \n\n2) Prières : Tu peux gérer tes prières dans cette section. \n\n3) Verset : Note tes versets préférés pour pouvoir les médités. \n\n4) Evénements : C'est ici que tu vas pouvoir t'inscire aux différents événements."}
          </p>
        </div>
        <div className="slideSLiderHelp">
          <div className="bulletContainer">
            <div
              className="bullet"
              style={{
                width: slide === "step1" ? "50px" : "10px",
                backgroundColor: slide === "step1" ? "#C6253D" : "#D9D9D9",
              }}
            ></div>
            <div
              className="bullet"
              style={{
                width: slide === "step2" ? "50px" : "10px",
                backgroundColor: slide === "step2" ? "#C6253D" : "#D9D9D9",
              }}
            ></div>
            <div
              className="bullet"
              style={{
                width: slide === "step3" ? "50px" : "10px",
                backgroundColor: slide === "step3" ? "#C6253D" : "#D9D9D9",
              }}
            ></div>
            <div
              className="bullet"
              style={{
                width: slide === "step4" ? "50px" : "10px",
                backgroundColor: slide === "step4" ? "#C6253D" : "#D9D9D9",
              }}
            ></div>
            <div
              className="bullet"
              style={{
                width: slide === "step5" ? "50px" : "10px",
                backgroundColor: slide === "step5" ? "#C6253D" : "#D9D9D9",
              }}
            ></div>
          </div>

          {slide !== "step2" || fullscreenActivated ? (
            <BsArrowRight
              onClick={() => increment()}
              size={50}
              color="#C6253D"
              style={{ display: slide === "step5" ? "none" : "block" }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TutoSlider;
