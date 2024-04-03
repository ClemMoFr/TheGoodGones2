import React, { useEffect, useState } from "react";
import "./Prieres.css";
import { FaChevronRight } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BiSolidChevronLeft } from "react-icons/bi";

import PopupAddPrieres from "../../components/prieres/popup-add-prieres/PopupAddPrieres";
import PopupModifyPrieres from "../../components/prieres/popup-modify-prieres/PopupModifyPrieres";
import PopupDetailsPrieres from "../../components/prieres/popup-details-prieres/PopupDetailsPrieres";

const Prieres = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [popupAddPrieres, setPopupAddPrieres] = useState(false);
  const [popupModifyPrieres, setPopupModifyPrieres] = useState(false);
  const [popupDetailsPrieres, setPopupDetailsPrieres] = useState(false);
  const [selectedPrieres, setSelectedPrieres] = useState(null);

  function toggleSlideCTA(index) {
    setActiveSlideIndex(index === activeSlideIndex ? null : index);
  }

  const [prieres, setPrieres] = useState([]);
  const [prieresTitle, setPrieresTitle] = useState("");
  const [prieresTexte, setPrieresTexte] = useState("");

  useEffect(() => {
    const savedPrieres = JSON.parse(localStorage.getItem("prieres")) || [];
    setPrieres(savedPrieres);
  }, []);

  const addPrieres = (e) => {
    e.preventDefault();
    const nouvellePrieres = {
      id: prieres.length + 1,
      prieresTitle: prieresTitle,
      prieresTexte: prieresTexte,
    };
    const updatedPrieres = [...prieres, nouvellePrieres];

    localStorage.setItem("prieres", JSON.stringify(updatedPrieres));

    setPrieres(updatedPrieres);
    setPopupAddPrieres(false);
    setPrieresTitle("");
    setPrieresTexte("");
  };

  const updatePrieres = (id, newPrieresTitle, newPrieresTexte) => {
    const updatedPrieres = prieres.map((prieres) =>
      prieres.id === id
        ? {
            ...prieres,
            prieresTitle: newPrieresTitle,
            prieresTexte: newPrieresTexte,
          }
        : prieres
    );

    localStorage.setItem("prieres", JSON.stringify(updatedPrieres));

    setPrieres(updatedPrieres);
    setPopupModifyPrieres(false);
  };

  const [messageDelete, setMessageDelete] = useState(false);

  const deletePrieres = (id) => {
    const updatedPrieres = prieres.filter((prieres) => prieres.id !== id);

    localStorage.setItem("prieres", JSON.stringify(updatedPrieres));

    setPrieres(updatedPrieres);
    setMessageDelete(false);
  };

  return (
    <div className="prieresMainContainer">
      <div className="prieresTop">
        <div className="prieresTopIcon"></div>
        <p className="prieresTopTitle">Mes prières</p>
      </div>
      <div className="prieresBottom">
        {popupDetailsPrieres && selectedPrieres ? (
          <PopupDetailsPrieres
            prieresTitle={selectedPrieres.prieresTitle}
            prieresTexte={selectedPrieres.prieresTexte}
            backArrowFunction={() => setPopupDetailsPrieres(false)}
          />
        ) : (
          <>
            <button
              className="btnAddGeneralStudy"
              onClick={() => setPopupAddPrieres(true)}
            >
              Ajouter une prière
            </button>
            <div className="prieresCardContainer">
              {prieres.map((prieres, index) => (
                <div
                  key={prieres.id}
                  className={`prieresCardMainContainer ${
                    index === activeSlideIndex
                      ? "positionCenter"
                      : "positionLeft"
                  }`}
                >
                  <div
                    className="prieresCard"
                    onClick={() => setSelectedPrieres(prieres)}
                  >
                    <div className="prieresNameAndArrow">
                      <p className="prieresName">{prieres.prieresTitle}</p>
                      <div
                        className={`prieresArrows ${
                          index === activeSlideIndex ? "arrowLeft" : ""
                        }`}
                        onClick={() => toggleSlideCTA(index)}
                      >
                        {[0, 1, 2, 3].map((item) => (
                          <BiSolidChevronLeft
                            key={item}
                            size={30}
                            style={{
                              position: "absolute",
                              right: `${item * 10}px`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setPopupDetailsPrieres(true);
                        setSelectedPrieres(prieres);
                      }}
                      style={{
                        width: "30px",
                        height: "30px",
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaChevronRight color="#C6253D" />
                    </div>
                  </div>
                  <div className="prieresCardContainerCTA">
                    <FaEdit
                      style={{ backgroundColor: "#4E77FF" }}
                      className="prieresCTA"
                      onClick={() => setPopupModifyPrieres(true)}
                    />
                    <FaTrashCan
                      style={{ backgroundColor: "#F4244E" }}
                      className="prieresCTA"
                      onClick={() => setMessageDelete(true)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {popupAddPrieres && (
        <PopupAddPrieres
          valuePrieresTitle={prieresTitle}
          onChangeValuePrieresTitle={(e) => setPrieresTitle(e.target.value)}
          valuePrieresTexte={prieresTexte}
          onChangeValueprieresTexte={(e) => setPrieresTexte(e.target.value)}
          addPrieres={addPrieres}
          backArrowFunction={() => setPrieres(false)}
        />
      )}
      {popupModifyPrieres && (
        <PopupModifyPrieres
          prieresId={selectedPrieres.id}
          prieresModifyTitle={selectedPrieres.prieresTitle}
          prieresModifyTexte={selectedPrieres.prieresTexte}
          updateprieres={updatePrieres}
          backArrowFunction={() => setPopupModifyPrieres(false)}
        />
      )}

      {messageDelete && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "2",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "90%",
              backgroundColor: "white",
              padding: " 30px",
              borderRadius: "30px",
            }}
          >
            <p>
              Confirmez la suppression de "{selectedPrieres.prieresTitle}" ?
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                fontSize: "1.4rem",
                marginTop: "30px",
              }}
            >
              <p
                onClick={() => deletePrieres(selectedPrieres.id)}
                style={{
                  padding: "5px 20px",
                  backgroundColor: "#c6253d",
                  fontSize: "1.2rem",
                  color: "white",
                  borderRadius: "30px",
                  border: "3px solid #c6253d",
                }}
              >
                oui
              </p>
              <p
                onClick={() => setMessageDelete(false)}
                style={{
                  padding: "5px 20px",
                  backgroundColor: "white",
                  fontSize: "1.2rem",
                  color: "#c6253d",
                  borderRadius: "30px",
                  border: "3px solid #c6253d",
                }}
              >
                non
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Prieres;
