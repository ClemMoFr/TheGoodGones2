import React, { useEffect, useState } from "react";

import "./PetitsGroupes.css";

import { BiSolidPencil } from "react-icons/bi";
import PopupAddPetitsGroupes from "../../../components/Groupes/popup-add-petits-groupes/PopupAddPetitsGroupes";
import PopupModifyPetitsGroupes from "../../../components/Groupes/popup-modify-petits-groupes/PopupModifyPetitsGroupes";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import CryptoJS from "crypto-js";

const PetitsGroupes = () => {
  const [groupSelector, setGroupSelector] = useState(true);
  const [groupSelectorData, setGroupSelectorData] = useState("gg");
  const [popupAddPetitsGroupes, setPopupAddPetitsGroupes] = useState(false);
  const [popupModifyPetitsGroupes, setPopupModifyPetitsGroupes] =
    useState(false);

  function toggleGroup() {
    setGroupSelector(!groupSelector);
    const groupSelectorState = groupSelector === false ? "gg" : "mini-gg";
    setGroupSelectorData(groupSelectorState);
  }

  const { database } = FirebaseConfig();

  const [jeunes, setJeunes] = useState([]);
  const [monos, setMonos] = useState([]);
  const [petitGroupesData, setPetitGroupesData] = useState([]);

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  const decryptArray = (arr) => {
    return arr.map((item) => {
      const bytes = CryptoJS.AES.decrypt(item, commonPass);
      return bytes.toString(CryptoJS.enc.Utf8);
    });
  };

  useEffect(() => {
    const dataRef = ref(database, `jeunes/${groupSelectorData}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setJeunes(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setJeunes([]);
      }
    });

    return () => unsubscribe();
  }, [database, groupSelectorData]);

  useEffect(() => {
    const dataRef = ref(database, `monos/${groupSelectorData}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setMonos(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setMonos([]);
      }
    });

    return () => unsubscribe();
  }, [database, groupSelectorData]);

  useEffect(() => {
    const dataRef = ref(database, `petit-groupes/${groupSelectorData}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        const decryptedDataArray = dataArray.map((data) => ({
          ...data,
          jeunesOnGroup: decryptArray(data.jeunesOnGroup),
          monosOnGroup: decryptArray(data.monosOnGroup),
        }));
        setPetitGroupesData(decryptedDataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setPetitGroupesData([]);
      }
    });

    return () => unsubscribe();
  }, [database, groupSelectorData]);

  return (
    <div className="petitsGroupesMainContainer">
      <div className="petitsGroupesTop">
        <div className="petitsGroupesTopIcon"></div>
        <p className="petitsGroupesTopTitle">Membres</p>
        <div
          className="petitsGroupesSlideContainer"
          onClick={() => toggleGroup()}
        >
          <div
            className={`petitsGroupesSlider ${
              groupSelector === true ? "gg-selected" : "mini-gg-selected"
            }`}
          >
            {groupSelector === true ? "GG" : "MINI-GG"}
          </div>
        </div>
      </div>
      <div className="petitsGroupesBottom">
        <p className="sliderTitle">Petits groupes</p>
        <button
          className="btnAddGroup"
          onClick={() => {
            setPopupAddPetitsGroupes(true);
          }}
        >
          ajouter un nouveau groupe
        </button>
        <div className="petitsGroupesCardContainer">
          {petitGroupesData.map((data) => (
            <div className="petitsGroupesCard">
              <div className="petitsGroupesCardTop">
                <p className="petitsGroupesCardGroupName">{data.groupName}</p>
                <div
                  className="petitsGroupesCardTopPastille"
                  onClick={() => setPopupModifyPetitsGroupes(data)}
                >
                  <BiSolidPencil size={20} color="#1C2A4B" />
                </div>
              </div>
              <p className="petitsGroupesCardTitle">
                Groupe de{" "}
                {data.monosOnGroup.map((mono, index) => (
                  <span key={mono}>
                    {index > 0 && " et "} {mono}
                  </span>
                ))}
              </p>
              <div className="petitsGroupesCardJeuneNameContainer">
                {data.jeunesOnGroup.map((jeune) => (
                  <p className="petitsGroupesCardJeuneName" key={jeune}>
                    {jeune}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {popupAddPetitsGroupes && (
        <PopupAddPetitsGroupes
          optionsMono={monos}
          optionsJeune={jeunes}
          groupSelectorData={groupSelectorData}
          backArrowFunction={() => setPopupAddPetitsGroupes(false)}
        />
      )}

      {popupModifyPetitsGroupes && (
        <PopupModifyPetitsGroupes
          optionsMono={monos}
          optionsJeune={jeunes}
          selectedGroup={popupModifyPetitsGroupes}
          groupSelectorData={groupSelectorData}
          petitGroupesDataId={popupModifyPetitsGroupes.id}
          decryptArray={decryptArray}
          backArrowFunction={() => setPopupModifyPetitsGroupes(false)}
        />
      )}
    </div>
  );
};

export default PetitsGroupes;
