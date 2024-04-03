import React, { useState } from "react";
import "./PopupAddPetitsGroupes.css";
import MultiSelect from "../../multi-select/MultiSelect";
import BackArrow from "../../back-arrow/BackArrow";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, push, update, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const PopupAddPetitsGroupes = ({
  optionsMono,
  optionsJeune,
  backArrowFunction,
  groupSelectorData,
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMonos, setSelectedMonos] = useState([]);
  const [selectedJeunes, setSelectedJeunes] = useState([]);

  const handleMonoSelect = (selected) => {
    setSelectedMonos(selected);
  };

  const handleJeuneSelect = (selected) => {
    setSelectedJeunes(selected);
  };

  const { database } = FirebaseConfig();

  const addGroup = () => {
    const groupId = uuidv4();
    const groupObject = {
      groupName: groupName,
      id: groupId,
      jeunesOnGroup: selectedJeunes,
      monosOnGroup: selectedMonos,
    };

    set(
      ref(database, `petit-groupes/${groupSelectorData}/${groupId}`),
      groupObject
    );

    setGroupName("");
    setSelectedMonos([]);
    setSelectedJeunes([]);
    backArrowFunction();
  };

  return (
    <div className="popupAddPetitsGroupesMainContainer">
      <form className="popupAddPetitsGroupes">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="title">
            Ajouter un <br />
            nouveau groupe
          </p>
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"relative"}
            xPosition={"0px"}
            yPosition={"0px"}
            icon={"cross"}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            <p style={{ fontWeight: "600" }}>Nom du groupe</p>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </label>
        </div>
        <label>
          <p style={{ fontWeight: "600" }}>Sélectionner les monos</p>
          <MultiSelect
            options={optionsMono}
            onSelect={handleMonoSelect}
            groupSelectorData={groupSelectorData}
            storageKey={"monos"}
            dataWanted={"monoName"}
            hexaBackground={"#e7f0ff"}
            dataValueLocalStorage={"isChecked"}
            onSameForm={false}
            needFlexWrap={true}
          />
        </label>
        <label>
          <p style={{ fontWeight: "600", marginTop: "20px" }}>
            Sélectionner les GG
          </p>
          <MultiSelect
            options={optionsJeune}
            onSelect={handleJeuneSelect}
            groupSelectorData={groupSelectorData}
            storageKey={"jeunes"}
            dataWanted={"jeuneName"}
            hexaBackground={"#e7f0ff"}
            dataValueLocalStorage={"isChecked"}
            onSameForm={false}
            needFlexWrap={true}
          />
        </label>
        <button type="button" className="btnAddPetitGroup" onClick={addGroup}>
          Ajouter le groupe
        </button>
      </form>
    </div>
  );
};

export default PopupAddPetitsGroupes;
