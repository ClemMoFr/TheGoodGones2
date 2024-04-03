import React, { useState, useEffect } from "react";
import "./PopupModifyPetitsGroupes.css";
import MultiSelect from "../../multi-select/MultiSelect";
import BackArrow from "../../back-arrow/BackArrow";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, get, set, remove } from "firebase/database";

const PopupModifyPetitsGroupes = ({
  optionsMono,
  optionsJeune,
  petitGroupesDataId,
  backArrowFunction,
  groupSelectorData,
  decryptArray,
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMonos, setSelectedMonos] = useState([]);
  const [selectedJeunes, setSelectedJeunes] = useState([]);
  const [messageDelete, setMessageDelete] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupRef = ref(
          database,
          `petit-groupes/${groupSelectorData}/${petitGroupesDataId}`
        );
        const snapshot = await get(groupRef);

        if (snapshot.exists()) {
          const groupData = snapshot.val();
          setGroupName(groupData.groupName);
          setSelectedMonos(groupData.monosOnGroup);
          setSelectedJeunes(groupData.jeunesOnGroup);
        } else {
          console.log("Group not found");
        }
      } catch (error) {
        console.error("Error fetching group details:", error.message);
      }
    };

    fetchGroupDetails();
  }, [petitGroupesDataId]);

  const { database } = FirebaseConfig();

  const updateGroup = () => {
    const updatedGroupObject = {
      groupName: groupName,
      id: petitGroupesDataId,
      jeunesOnGroup: selectedJeunes,
      monosOnGroup: selectedMonos,
    };

    try {
      const groupRef = ref(
        database,
        `petit-groupes/${groupSelectorData}/${petitGroupesDataId}`
      );
      set(groupRef, updatedGroupObject);
    } catch (error) {
      console.error("Error updating group:", error.message);
    }
    backArrowFunction();
  };

  const deleteGroup = () => {
    try {
      const groupRef = ref(
        database,
        `petit-groupes/${groupSelectorData}/${petitGroupesDataId}`
      );
      remove(groupRef);
      setMessageDelete(false);
    } catch (error) {
      console.error("Error deleting group:", error.message);
    }
    backArrowFunction();
  };

  return (
    <div className="popupModifyPetitsGroupesMainContainer">
      <form className="popupModifyPetitsGroupes">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="title">
            Modifier le <br />
            groupe
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
            onSelect={setSelectedMonos}
            groupSelectorData={groupSelectorData}
            storageKey={"monos"}
            dataWanted={"monoName"}
            hexaBackground={"#e7f0ff"}
            dataValueLocalStorage={"isChecked"}
            onSameForm={false}
            needFlexWrap={true}
            elementOnLocalStorage={selectedMonos.map((mono) => (
              <p className="blocTypeSelectMonoPastille" key={mono}>
                {decryptArray([mono])}
              </p>
            ))}
          />
        </label>

        <label>
          <p style={{ fontWeight: "600", marginTop: "20px" }}>
            Sélectionner les GG
          </p>
          <MultiSelect
            options={optionsJeune}
            onSelect={setSelectedJeunes}
            groupSelectorData={groupSelectorData}
            storageKey={"jeunes"}
            dataWanted={"jeuneName"}
            hexaBackground={"#e7f0ff"}
            dataValueLocalStorage={"isChecked"}
            onSameForm={false}
            needFlexWrap={true}
            initialValue={selectedJeunes}
            elementOnLocalStorage={selectedJeunes.map((jeune) => (
              <p className="blocTypeSelectMonoPastille" key={jeune}>
                {decryptArray([jeune])}
              </p>
            ))}
          />
        </label>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
        >
          <button className="btnModifyPetitGroup" onClick={updateGroup}>
            Modifier
          </button>
          <button
            type="button"
            className="btnModifyPetitGroup"
            onClick={() => setMessageDelete(true)}
          >
            Supprimer
          </button>
        </div>
      </form>
      {messageDelete && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafcff",
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0px",
            left: "0px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "0px 0px 30px 0px rgba(203, 228, 255, 0.60)",
              padding: "30px",
              width: "80%",
              fontSize: "1rem",
              borderRadius: "20px",
            }}
          >
            <p
              style={{
                marginBottom: "20px",
              }}
            >
              Confirmez la suppression de {groupName} ?
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "50%",
                justifyContent: "space-between",
                fontSize: "1.4rem",
              }}
            >
              <p onClick={deleteGroup}>oui</p>
              <p onClick={() => setMessageDelete(false)}>non</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupModifyPetitsGroupes;
