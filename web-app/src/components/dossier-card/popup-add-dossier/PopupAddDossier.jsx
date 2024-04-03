import React, { useEffect, useState } from "react";
import "./PopupAddDossier.css";
import { PiFolderOpenFill } from "react-icons/pi";
import { BsFillTrash3Fill } from "react-icons/bs";
import BackArrow from "../../../components/back-arrow/BackArrow";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

const PopupAddDossier = ({
  onClose,
  backArrowFunction,
  groupSelectorData,
  decryptField,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const options = ["Assurance", "Carte d'identité"];
  const [gg, setGG] = useState([]);
  const [miniGg, setMiniGg] = useState([]);
  const [monos, setMonos] = useState([]);

  const [dossierData, setDossierData] = useState({
    dossierOwner: "",
    dossierElements: [],
  });

  const { database } = FirebaseConfig();

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

        setGG([...dataArrayJeunesGG]);
        setMiniGg([...dataArrayJeunesMiniGG]);
        setMonos([...dataArrayMonosGG, ...dataArrayMonosMiniGG]);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error.message);
      }
    };
    fetchData();
  }, [database]);

  useEffect(() => {
    setDossierData({
      ...dossierData,
      dossierElements: selectedItems,
    });
  }, [selectedItems]);

  const createDossier = async () => {
    try {
      if (!dossierData.dossierOwner || selectedItems.length === 0) {
        console.error("Veuillez sélectionner une personne et des documents.");
        return;
      }

      const dossierPath = `dossiers/${groupSelectorData}/${dossierData.dossierOwner}`;
      const databaseRef = ref(database, dossierPath);

      await set(databaseRef, {
        dossierOwner: dossierData.dossierOwner,
        dossierElements: selectedItems,
      });

      setDossierData({
        dossierOwner: "",
        dossierElements: [],
      });

      onClose();
    } catch (error) {
      console.error("Error creating dossier:", error.message);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedOption(item);
  };

  const handleUnselectItem = (item) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => selectedItem !== item)
    );
  };

  const filteredOptions = options.filter(
    (option) => !selectedItems.includes(option)
  );

  const handleAddSelectedItem = () => {
    if (selectedOption) {
      setSelectedItems([...selectedItems, selectedOption]);
      setIsPopupVisible(true);
      setSelectedOption("");
    }
  };

  return (
    <div className="popupAddDossierMainContainer">
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          padding: "0px 20px",
          width: "100%",
        }}
      >
        <p className="popupAddTitleJeune">
          Créer un <br />
          dossier
        </p>
        <BackArrow
          backArrowFunction={backArrowFunction}
          arrowPosition={"absolute"}
          xPosition={"20px"}
          yPosition={"20px"}
          icon={"arrow"}
        />
      </div>
      <form>
        <label>
          personne concernée
          <div
            className="popupAddDossierSelectContainer"
            style={{ backgroundColor: "#FAFCFF" }}
          >
            <select
              style={{
                width: "75%",
                marginRight: "10px",
                height: "50px",
              }}
              value={dossierData.dossierOwner}
              onChange={(e) =>
                setDossierData({
                  ...dossierData,
                  dossierOwner: e.target.value,
                })
              }
            >
              <option value="">Sélectionnez une personne</option>

              {groupSelectorData === "monos" &&
                monos.map((mono) => (
                  <option
                    key={mono.additionalInfo.monoFirstName}
                    value={mono.monoFirstName}
                  >
                    {decryptField(mono.additionalInfo.monoFirstName)}
                  </option>
                ))}
              {groupSelectorData === "gg" &&
                gg.map((gg) => (
                  <option
                    key={gg.additionalInfo.jeuneFirstName}
                    value={gg.additionalInfo.jeuneFirstName}
                  >
                    {decryptField(gg.additionalInfo.jeuneFirstName)}
                  </option>
                ))}
              {groupSelectorData === "mini-gg" &&
                miniGg.map((miniGg) => (
                  <option
                    key={miniGg.additionalInfo.jeuneFirstName}
                    value={miniGg.additionalInfo.jeuneFirstName}
                  >
                    {decryptField(miniGg.additionalInfo.jeuneFirstName)}
                  </option>
                ))}
            </select>
          </div>
        </label>

        <label>
          documents demandés
          <div className="popupAddDossierSelectContainer">
            <select
              style={{
                width: "75%",
                marginRight: "10px",
                height: "50px",
              }}
              value={selectedOption}
              onChange={(e) => handleSelectItem(e.target.value)}
            >
              <option value="">Sélectionnez un élément</option>
              {filteredOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAddSelectedItem}>
              Ok
            </button>
          </div>
        </label>
      </form>
      {isPopupVisible && selectedItems.length > 0 && (
        <div className="popupAddDossierDocumentsContainer">
          {selectedItems.map((item) => (
            <div key={item} className="popupAddDossierDocumentsCard">
              <PiFolderOpenFill size={30} color="#1C2A4B" />
              <p style={{ color: "#1C2A4B" }}>{item}</p>
              <button onClick={() => handleUnselectItem(item)}>retirer</button>
            </div>
          ))}
        </div>
      )}
      <button
        style={{
          padding: "20px",
          fontSize: "1.2rem",
          color: "white",
          borderRadius: "30px",
          border: "none",
          backgroundColor: "#c6253d",
          marginTop: "20px",
        }}
        type="button"
        onClick={createDossier}
      >
        Créer le dossier
      </button>
    </div>
  );
};

export default PopupAddDossier;
