import React, { useEffect, useState } from "react";
import "./Versets.css";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

import PopupAddVersets from "../../components/versets/popup-add-versets/PopupAddVersets";
import PopupModifyVersets from "../../components/versets/popup-modify-versets/PopupModifyVersets";
import PopupDetailsVersets from "../../components/versets/popup-details-versets/PopupDetailsVersets";

const Versets = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [popupAddVersets, setPopupAddVersets] = useState(false);
  const [popupModifyVersets, setPopupModifyVersets] = useState(false);
  const [popupDetailsVersets, setPopupDetailsVersets] = useState(false);
  const [selectedVersets, setSelectedVersets] = useState(null);

  const [versets, setVersets] = useState([]);
  const [versetsTitle, setVersetsTitle] = useState("");
  const [versetsTexte, setVersetsTexte] = useState("");

  useEffect(() => {
    const savedVersets = JSON.parse(localStorage.getItem("versets")) || [];
    setVersets(savedVersets);
  }, []);

  const addVersets = (e) => {
    e.preventDefault();
    const nouvelleVersets = {
      id: versets.length + 1,
      versetsTitle: versetsTitle,
      versetsTexte: versetsTexte,
    };
    const updatedVersets = [...versets, nouvelleVersets];

    localStorage.setItem("versets", JSON.stringify(updatedVersets));

    setVersets(updatedVersets);
    setPopupAddVersets(false);
    setVersetsTitle("");
    setVersetsTexte("");
  };

  const updateVersets = (id, newVersetsTitle, newVersetsTexte) => {
    const updatedVersets = versets.map((versets) =>
      versets.id === id
        ? {
            ...versets,
            versetsTitle: newVersetsTitle,
            versetsTexte: newVersetsTexte,
          }
        : versets
    );

    localStorage.setItem("versets", JSON.stringify(updatedVersets));

    setVersets(updatedVersets);
    setPopupModifyVersets(false);
  };

  const [messageDelete, setMessageDelete] = useState(false);

  const deleteVersets = (id) => {
    const updatedVersets = versets.filter((versets) => versets.id !== id);

    localStorage.setItem("versets", JSON.stringify(updatedVersets));

    setVersets(updatedVersets);
    setMessageDelete(false);
  };

  return (
    <div className="versetsMainContainer">
      <div className="versetsTop">
        <div className="versetsTopIcon"></div>
        <p className="versetsTopTitle">Mes versets</p>
      </div>
      <div className="versetsBottom">
        {popupDetailsVersets && selectedVersets ? (
          <PopupDetailsVersets
            versetsTitle={selectedVersets.versetsTitle}
            versetsTexte={selectedVersets.versetsTexte}
            backArrowFunction={() => setPopupDetailsVersets(false)}
          />
        ) : (
          <>
            <button
              className="btnAddGeneralStudy"
              onClick={() => setPopupAddVersets(true)}
            >
              Ajouter un verset
            </button>
            <div className="versetsCardContainer">
              {versets.map((versets, index) => (
                <div
                  key={versets.id}
                  className={`versetsCardMainContainer ${
                    index === activeSlideIndex
                      ? "positionCenter"
                      : "positionLeft"
                  }`}
                >
                  <div
                    className="versetsCard"
                    onClick={() => setSelectedVersets(versets)}
                  >
                    <div className="versetsNameAndArrow">
                      <div className="versetsCardContainerCTA">
                        <FaEdit
                          style={{ backgroundColor: "#4E77FF" }}
                          className="versetsCTA"
                          onClick={() => setPopupModifyVersets(true)}
                        />
                        <FaTrashCan
                          style={{ backgroundColor: "#F4244E" }}
                          className="versetsCTA"
                          onClick={() => setMessageDelete(true)}
                        />
                      </div>
                      <p className="versetsTexte">{versets.versetsTexte}</p>
                      <p className="versetsName">{versets.versetsTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {popupAddVersets && (
        <PopupAddVersets
          valueVersetsTitle={versetsTitle}
          onChangeValueVersetsTitle={(e) => setVersetsTitle(e.target.value)}
          valueVersetsTexte={versetsTexte}
          onChangeValueVersetsTexte={(e) => setVersetsTexte(e.target.value)}
          addVersets={addVersets}
          backArrowFunction={() => setPopupAddVersets(false)}
        />
      )}
      {popupModifyVersets && (
        <PopupModifyVersets
          versetsId={selectedVersets.id}
          versetsModifyTitle={selectedVersets.versetsTitle}
          versetsModifyTexte={selectedVersets.versetsTexte}
          updateversets={updateVersets}
          backArrowFunction={() => setPopupModifyVersets(false)}
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
              Confirmez la suppression de "{selectedVersets.versetsTitle}" ?
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
                onClick={() => deleteVersets(selectedVersets.id)}
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

export default Versets;
