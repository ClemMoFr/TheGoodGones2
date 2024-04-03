import React, { useState } from "react";

import "./Tuto.css";
import { Link } from "react-router-dom";

import { BsArrowsFullscreen } from "react-icons/bs";

const Tuto = () => {
  const [tuto1, setTuto1] = useState(true);

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
    setTuto1(false);
  }

  return (
    <>
      {!tutoSteps.includes("step1") && (
        <div className="mask-circle">
          {tuto1 && (
            <Link to="parametres" onClick={() => handleClick("step1")}>
              <div className="btn-go" />
            </Link>
          )}

          <div className="popup-explain-home-page">
            <p>Version démo</p>
            <p>Bienvenue !</p>
            {tuto1 ? (
              <>
                <div className="pulse-element-main-container">
                  <div className="pulse-element"></div>
                  <BsArrowsFullscreen
                    onClick={activerModePleinEcranTuto}
                    className="picto"
                  />
                </div>
                <p>
                  Avant toute chose, l'activation du mode pleine écran est
                  fortement conseillé.
                </p>
              </>
            ) : (
              <p>A présent rendez-vous dans les paramètres !</p>
            )}
          </div>
        </div>
      )}
      {!tutoSteps.includes("step2") && (
        <div className="mask-rectangle-parametre"></div>
      )}
    </>
  );
};
export default Tuto;
