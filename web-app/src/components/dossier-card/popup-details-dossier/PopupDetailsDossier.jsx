import React, { useState, useEffect } from "react";
import "./PopupDetailsDossier.css";
import { PiFolderOpenFill } from "react-icons/pi";
import BackArrow from "../../back-arrow/BackArrow";
import { ref, update } from "firebase/database";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

const PopupDetailsDossier = ({
  member,
  groupSelectorData,
  backArrowFunction,
  onDelete,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const options = ["Assurance", "Carte d'identité"];
  const { database } = FirebaseConfig();

  useEffect(() => {
    setSelectedItems(member.dossierElements);
  }, [member]);

  const handleSelectItem = (item) => {
    setSelectedOption(item);
  };

  const handleUnselectItem = async (item) => {
    const updatedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
    setSelectedItems(updatedItems);

    const dossierRef = ref(
      database,
      `dossiers/${groupSelectorData}/${member.dossierOwner}`
    );

    await update(dossierRef, { dossierElements: updatedItems });
  };

  const handleAddSelectedItem = async () => {
    if (selectedOption) {
      const updatedItems = [...selectedItems, selectedOption];
      setSelectedItems(updatedItems);
      setSelectedOption("");

      const dossierRef = ref(
        database,
        `dossiers/${groupSelectorData}/${member.dossierOwner}`
      );

      await update(dossierRef, { dossierElements: updatedItems });
    }
  };

  return (
    <div className="popupDetailsDossierMainContainer">
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          marginBottom: "30px",
          width: "100%",
        }}
      >
        <BackArrow
          backArrowFunction={backArrowFunction}
          arrowPosition={"absolute"}
          xPosition={"30px"}
          yPosition={"20px"}
          icon={"arrow"}
        />
      </div>
      <p>{member.dossierJeune}</p>
      {member.dossierElements.length <= 1 && (
        <form>
          <label>
            documents demandés
            <div className="popupDetailsDossierSelectContainer">
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
                {options.map((option) => (
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
      )}

      {selectedItems.length > 0 && (
        <div className="popupDetailsDossierDocumentsContainer">
          {selectedItems.map((item) => (
            <div key={item} className="popupDetailsDossierDocumentsCard">
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
        }}
        type="button"
        onClick={onDelete}
      >
        Supprimer le dossier
      </button>
    </div>
  );
};

export default PopupDetailsDossier;
