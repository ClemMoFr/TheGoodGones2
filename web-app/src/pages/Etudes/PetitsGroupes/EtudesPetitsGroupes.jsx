import React, { useEffect, useState } from "react";
import "./EtudesPetitsGroupes.css";
import { FaChevronRight } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BiSolidChevronLeft } from "react-icons/bi";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import PopupDetailsEtudesPetitsGroupes from "../../../components/Etudes/Etudes-petits-groupes/popup-details-etudes-petits-groupes/PopupDetailsEtudesPetitsGroupes";
import PopupAddEtudesPetitsGroupes from "../../../components/Etudes/Etudes-petits-groupes/popup-add-etudes-petits-groupes/PopupAddEtudesPetitsGroupes";
import PopupModifyEtudesPetitsGroupes from "../../../components/Etudes/Etudes-petits-groupes/popup-modify-etudes-petits-groupes/PopupModifyEtudesPetitsGroupes";
import { useAuth } from "../../../firebase/AuthContext";

const EtudesPetitsGroupes = () => {
  const [groupSelector, setGroupSelector] = useState(true);
  const [groupSelectorData, setGroupSelectorData] = useState("gg");
  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [popupAddEtudesPetitsGroupes, setPopupAddEtudesPetitsGroupes] =
    useState(false);
  const [popupModifyEtudesPetitsGroupes, setPopupModifyEtudesPetitsGroupes] =
    useState(false);
  const [popupDetailsEtudesPetitsGroupes, setPopupDetailsEtudesPetitsGroupes] =
    useState(false);
  const [selectedEtude, setSelectedEtude] = useState(null);
  const [messageDelete, setMessageDelete] = useState(false);

  function toggleGroup() {
    if (userData && userData.additionalInfo.status === "jeune") {
      setGroupSelectorData(userData.additionalInfo.groupSelectorData);
    } else {
      setGroupSelectorData((prevGroupSelectorData) =>
        prevGroupSelectorData === "gg" ? "mini-gg" : "gg"
      );
    }

    setGroupSelector(!groupSelector);
  }

  function toggleSlideCTA(index) {
    setActiveSlideIndex(index === activeSlideIndex ? null : index);
  }

  const [etudesPetitsGroupes, setEtudesPetitsGroupes] = useState([]);
  const [etudePetitsGroupesTitle, setEtudePetitsGroupesTitle] = useState("");
  const [etudePetitsGroupesDescription, setEtudePetitsGroupesDescription] =
    useState("");

  const { database } = FirebaseConfig();
  const { userData } = useAuth();

  useEffect(() => {
    if (userData) {
      if (userData.additionalInfo.status === "jeune") {
        setGroupSelectorData(userData.additionalInfo.groupSelectorData);
      } else {
        setGroupSelectorData(groupSelector ? "gg" : "mini-gg");
      }
    }

    const dataRef = ref(
      database,
      `etudes/etudesPetitsGroupe/${groupSelectorData}`
    );
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setEtudesPetitsGroupes(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setEtudesPetitsGroupes([]);
      }
    });

    return () => unsubscribe();
  }, [database, groupSelectorData, userData]);

  if (!userData) {
    return <div>Chargement...</div>;
  }
  const addEtudePetitsGroupes = (nouvelleEtudePetitsGroupes) => {
    const etudePetitGroupeId = uuidv4();

    const etudeRef = ref(
      database,
      `etudes/etudesPetitsGroupe/${groupSelectorData}/${etudePetitGroupeId}`
    );

    set(etudeRef, {
      id: etudePetitGroupeId,
      etudePetitsGroupesTitle:
        nouvelleEtudePetitsGroupes.etudePetitsGroupesTitle,
      etudePetitsGroupesDescription:
        nouvelleEtudePetitsGroupes.etudePetitsGroupesDescription,
      questions: nouvelleEtudePetitsGroupes.questions,
      status: false,
    });

    setPopupAddEtudesPetitsGroupes(false);
    setEtudePetitsGroupesTitle("");
    setEtudePetitsGroupesDescription("");
  };

  const updateEtudePetitsGroupes = async (updatedEtudePetitsGroupes) => {
    const etudeRef = ref(
      database,
      `etudes/etudesPetitsGroupe/${groupSelectorData}/${updatedEtudePetitsGroupes.id}`
    );

    try {
      await set(etudeRef, {
        id: updatedEtudePetitsGroupes.id,
        etudePetitsGroupesTitle:
          updatedEtudePetitsGroupes.etudePetitsGroupesTitle,
        etudePetitsGroupesDescription:
          updatedEtudePetitsGroupes.etudePetitsGroupesDescription,
        questions: updatedEtudePetitsGroupes.questions,
      });

      setEtudesPetitsGroupes((prevEtudes) =>
        prevEtudes.map((etude) =>
          etude.id === updatedEtudePetitsGroupes.id
            ? updatedEtudePetitsGroupes
            : etude
        )
      );

      setPopupModifyEtudesPetitsGroupes(false);

      setSelectedEtude(updatedEtudePetitsGroupes);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étude:", error.message);
    }
  };

  const deleteEtudePetitsGroupes = async (id) => {
    const etudeRef = ref(
      database,
      `etudes/etudesPetitsGroupe/${groupSelectorData}/${id}`
    );
    try {
      await remove(etudeRef);
      setEtudesPetitsGroupes((prevEtudes) =>
        prevEtudes.filter((etude) => etude.id !== id)
      );
      setMessageDelete(false);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'étude :",
        error.message
      );
    }
  };

  const updateStatus = async (etudeId) => {
    const etudeRef = ref(
      database,
      `etudes/etudesPetitsGroupe/${groupSelectorData}/${etudeId}`
    );

    try {
      await update(etudeRef, {
        status: true,
      });
      console.log("Statut mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error.message);
    }
  };

  return (
    <div className="etudesPetitsGroupesMainContainer">
      <div className="etudesPetitsGroupesTop">
        <div className="etudesPetitsGroupesTopIcon"></div>
        <p className="etudesPetitsGroupesTopTitle">Etudes</p>
        {userData &&
          userData.additionalInfo &&
          (userData.additionalInfo.status === "monos" ||
            userData.additionalInfo.status === "admin") && (
            <div className="etudesSlideContainer" onClick={toggleGroup}>
              <div
                className={`etudesSlider ${
                  groupSelector ? "gg-selected" : "mini-gg-selected"
                }`}
              >
                {groupSelector ? "GG" : "MINI-GG"}
              </div>
            </div>
          )}
      </div>
      <div className="etudesPetitsGroupesBottom">
        {popupDetailsEtudesPetitsGroupes && selectedEtude ? (
          <PopupDetailsEtudesPetitsGroupes
            etudeTitle={selectedEtude.etudePetitsGroupesTitle}
            etudeDescription={selectedEtude.etudePetitsGroupesDescription}
            questions={selectedEtude.questions}
            status={selectedEtude.status}
            userData={userData}
            backArrowFunction={() => setPopupDetailsEtudesPetitsGroupes(false)}
            updateStatus={() => updateStatus(selectedEtude.id)}
          />
        ) : (
          <>
            <p className="title">
              {" "}
              {userData.additionalInfo.status === "jeune"
                ? "Mes études"
                : "Etudes petits groupes"}
            </p>
            {userData &&
              userData.additionalInfo &&
              (userData.additionalInfo.status === "monos" ||
                userData.additionalInfo.status === "admin") && (
                <button
                  className="btnAddGeneralStudy"
                  onClick={() => setPopupAddEtudesPetitsGroupes(true)}
                >
                  Ajouter une étude petits groupes
                </button>
              )}
            <div className="etudesPetitsGroupesCardContainer">
              {etudesPetitsGroupes
                .filter((etude) => {
                  return userData.additionalInfo.status === "jeune"
                    ? etude.status === true
                    : true;
                })
                .map((etude, index) => (
                  <div
                    key={etude.id}
                    className={`etudesPetitsGroupesCardMainContainer ${
                      index === activeSlideIndex
                        ? "positionCenter"
                        : "positionLeft"
                    }`}
                  >
                    <div
                      className="etudesPetitsGroupesCard"
                      onClick={() => setSelectedEtude(etude)}
                    >
                      <div className="etudesPetitsGroupesNameAndArrow">
                        <p className="etudesPetitsGroupesName">
                          {etude.etudePetitsGroupesTitle}
                        </p>
                        {userData &&
                          userData.additionalInfo &&
                          (userData.additionalInfo.status === "monos" ||
                            userData.additionalInfo.status === "admin") && (
                            <div
                              className={`etudesPetitsGroupesArrows ${
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
                          )}
                      </div>

                      <div
                        onClick={() => {
                          setPopupDetailsEtudesPetitsGroupes(true);
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
                      <p className="etudesPetitsGroupesDescription">
                        {etude.etudePetitsGroupesDescription}
                      </p>
                    </div>
                    {userData &&
                      userData.additionalInfo &&
                      (userData.additionalInfo.status === "monos" ||
                        userData.additionalInfo.status === "admin") && (
                        <div className="etudesPetitsGroupesCardContainerCTA">
                          <FaEdit
                            style={{ backgroundColor: "#4E77FF" }}
                            className="etudesPetitsGroupesCTA"
                            onClick={() => {
                              setPopupModifyEtudesPetitsGroupes(true);
                              setSelectedEtude(etude);
                            }}
                          />
                          <FaTrashCan
                            style={{ backgroundColor: "#F4244E" }}
                            className="etudesPetitsGroupesCTA"
                            onClick={() => setMessageDelete(true)}
                          />
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      {popupAddEtudesPetitsGroupes && (
        <PopupAddEtudesPetitsGroupes
          valueEtudePetitsGroupesTitle={etudePetitsGroupesTitle}
          onChangeValueEtudePetitsGroupesTitle={(e) =>
            setEtudePetitsGroupesTitle(e.target.value)
          }
          addEtudePetitGroupe={addEtudePetitsGroupes}
          backArrowFunction={() => setPopupAddEtudesPetitsGroupes(false)}
        />
      )}
      {popupModifyEtudesPetitsGroupes && (
        <PopupModifyEtudesPetitsGroupes
          selectedEtude={selectedEtude}
          updateEtudePetitsGroupes={updateEtudePetitsGroupes}
          closePopup={() => setPopupModifyEtudesPetitsGroupes(false)}
          backArrowFunction={() => setPopupModifyEtudesPetitsGroupes(false)}
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
              Confirmez la suppression de "
              {selectedEtude.etudePetitsGroupesTitle}" ?
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
                onClick={() => deleteEtudePetitsGroupes(selectedEtude.id)}
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

export default EtudesPetitsGroupes;
