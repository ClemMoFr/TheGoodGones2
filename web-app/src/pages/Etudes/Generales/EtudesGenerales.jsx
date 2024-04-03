import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import "./EtudesGenerales.css";
import { FaChevronRight } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BiSolidChevronLeft } from "react-icons/bi";
import PopupModifyEtudesGenerales from "../../../components/Etudes/Etudes-generales/popup-modify-etudes-generales/PopupModifyEtudesGenerales";
import PopupDetailsEtudesGenerales from "../../../components/Etudes/Etudes-generales/popup-details-etudes-generales/PopupDetailsEtudesGenerales";
import PopupAddEtudesGenerales from "../../../components/Etudes/Etudes-generales/popup-add-etudes-generales/PopupAddEtudesGenerales";

const EtudesGenerales = () => {
  const [groupSelector, setGroupSelector] = useState(true);
  const [groupSelectorData, setGroupSelectorData] = useState("gg");
  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [popupAddEtudesGenerales, setPopupAddEtudesGenerales] = useState(false);
  const [popupModifyEtudesGenerales, setPopupModifyEtudesGenerales] =
    useState(false);
  const [popupDetailsEtudesGenerales, setPopupDetailsEtudesGenerales] =
    useState(false);
  const [selectedEtude, setSelectedEtude] = useState(null);

  function toggleGroup() {
    setGroupSelector(!groupSelector);
    const groupSelectorState = groupSelector === false ? "gg" : "mini-gg";
    setGroupSelectorData(groupSelectorState);
  }

  function toggleSlideCTA(index) {
    setActiveSlideIndex(index === activeSlideIndex ? null : index);
  }

  const { database } = FirebaseConfig();

  const [etudesGenerales, setEtudesGenerales] = useState([]);
  const [etudeGeneraleTitle, setEtudeGeneraleTitle] = useState("");
  const [etudeGeneraleDescription, setEtudeGeneraleDescription] = useState("");
  const [etudeGeneraleTexte, setEtudeGeneraleTexte] = useState("");

  useEffect(() => {
    const dataRef = ref(
      database,
      `etudes/etudesGenerales/${groupSelectorData}`
    );
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setEtudesGenerales(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setEtudesGenerales([]);
      }
    });
    return () => unsubscribe();
  }, [database, groupSelectorData]);

  const addEtudeGenerale = (e) => {
    const etudeGeneraleId = uuidv4();
    set(
      ref(
        database,
        `etudes/etudesGenerales/${groupSelectorData}/${etudeGeneraleId}`
      ),
      {
        id: etudeGeneraleId,
        etudeGeneraleTitle: etudeGeneraleTitle,
        etudeGeneraleDescription: etudeGeneraleDescription,
        etudeGeneraleTexte: etudeGeneraleTexte,
        groupSelectorData: groupSelectorData,
      }
    );

    e.preventDefault();

    setPopupAddEtudesGenerales(false);
    setEtudeGeneraleTitle("");
    setEtudeGeneraleDescription("");
    setEtudeGeneraleTexte("");
  };

  const updateEtudesGenerales = (
    id,
    newEtudeGeneraleTitle,
    newEtudeGeneraleDescription,
    newEtudeGeneraleTexte
  ) => {
    const etudesGeneralesRef = ref(
      database,
      `etudes/etudesGenerales/${groupSelectorData}/${id}`
    );

    const updates = {
      etudeGeneraleTitle: newEtudeGeneraleTitle,
      etudeGeneraleDescription: newEtudeGeneraleDescription,
      etudeGeneraleTexte: newEtudeGeneraleTexte,
    };

    update(etudesGeneralesRef, updates)
      .then(() => {
        console.log("Mise à jour réussie!");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour:", error.message);
      });

    setPopupModifyEtudesGenerales(false);
  };

  const [messageDelete, setMessageDelete] = useState(false);

  const deleteEtudeGenerale = async (id) => {
    try {
      await remove(
        ref(database, `etudes/etudesGenerales/${groupSelectorData}/${id}`)
      );

      const updatedEtudeGenerale = etudesGenerales.filter(
        (etudeGenerale) => etudeGenerale.id !== id
      );
      setEtudesGenerales(updatedEtudeGenerale);

      setMessageDelete(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.message);
    }
  };

  return (
    <div className="etudesGeneralesMainContainer">
      <div className="etudesGeneralesTop">
        <div className="etudesGeneralesTopIcon"></div>
        <p className="etudesGeneralesTopTitle">Etudes</p>
        <div className="etudesSlideContainer" onClick={toggleGroup}>
          <div
            className={`etudesSlider ${
              groupSelector ? "gg-selected" : "mini-gg-selected"
            }`}
          >
            {groupSelector ? "GG" : "MINI-GG"}
          </div>
        </div>
      </div>
      <div className="etudesGeneralesBottom">
        {popupDetailsEtudesGenerales && selectedEtude ? (
          <PopupDetailsEtudesGenerales
            etudeTitle={selectedEtude.etudeGeneraleTitle}
            etudeDescription={selectedEtude.etudeGeneraleDescription}
            etudeTexte={selectedEtude.etudeGeneraleTexte}
            backArrowFunction={() => setPopupDetailsEtudesGenerales(false)}
          />
        ) : (
          <>
            <p className="title">Etudes générales</p>
            <button
              className="btnAddGeneralStudy"
              onClick={() => setPopupAddEtudesGenerales(true)}
            >
              Ajouter une étude générale
            </button>
            <div className="etudesGeneralesCardContainer">
              {etudesGenerales.map((etude, index) => (
                <div
                  key={etude.id}
                  className={`etudesGeneralesCardMainContainer ${
                    index === activeSlideIndex
                      ? "positionCenter"
                      : "positionLeft"
                  }`}
                >
                  <div
                    className="etudesGeneralesCard"
                    onClick={() => setSelectedEtude(etude)}
                  >
                    <div className="etudesGeneralesNameAndArrow">
                      <p className="etudesGeneralesName">
                        {etude.etudeGeneraleTitle}
                      </p>
                      <div
                        className={`etudesGeneralesArrows ${
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
                    <p className="etudesGeneralesDescription">
                      {etude.etudeGeneraleDescription}
                    </p>
                    <div
                      onClick={() => {
                        setPopupDetailsEtudesGenerales(true);
                        setSelectedEtude(etude);
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
                  <div className="etudesGeneralesCardContainerCTA">
                    <FaEdit
                      style={{ backgroundColor: "#4E77FF" }}
                      className="etudesGeneralesCTA"
                      onClick={() => setPopupModifyEtudesGenerales(true)}
                    />
                    <FaTrashCan
                      style={{ backgroundColor: "#F4244E" }}
                      className="etudesGeneralesCTA"
                      onClick={() => setMessageDelete(true)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {popupAddEtudesGenerales && (
        <PopupAddEtudesGenerales
          valueEtudeGeneraleTitle={etudeGeneraleTitle}
          onChangeValueEtudeGeneraleTitle={(e) =>
            setEtudeGeneraleTitle(e.target.value)
          }
          valueEtudeGeneraleDescription={etudeGeneraleDescription}
          onChangeValueEtudeGeneraleDescription={(e) =>
            setEtudeGeneraleDescription(e.target.value)
          }
          valueEtudeGeneraleTexte={etudeGeneraleTexte}
          onChangeValueEtudeGeneraleTexte={(e) =>
            setEtudeGeneraleTexte(e.target.value)
          }
          addEtudeGenerale={addEtudeGenerale}
          backArrowFunction={() => setPopupAddEtudesGenerales(false)}
        />
      )}
      {popupModifyEtudesGenerales && (
        <PopupModifyEtudesGenerales
          etudeGeneraleId={selectedEtude.id}
          etudeGeneraleModifyTitle={etudesGenerales.etudeTitle}
          etudeGeneraleModifyDescription={etudesGenerales.etudeDescription}
          etudeGeneraleModifyTexte={etudesGenerales.etudeTexte}
          groupSelectorData={groupSelectorData}
          updateEtudeGenerale={updateEtudesGenerales}
          backArrowFunction={() => setPopupModifyEtudesGenerales(false)}
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
              Confirmez la suppression de "{selectedEtude.etudeGeneraleTitle}" ?
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
                onClick={() => deleteEtudeGenerale(selectedEtude.id)}
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

export default EtudesGenerales;
