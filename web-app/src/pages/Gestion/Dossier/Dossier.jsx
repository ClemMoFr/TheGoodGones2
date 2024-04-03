import React, { useEffect, useState } from "react";

import { ref, set, get, update, onValue, remove } from "firebase/database";
import CryptoJS from "crypto-js";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

import "./Dossier.css";
import DossierCard from "../../../components/dossier-card/DossierCard";
import PopupDetailsDossier from "../../../components/dossier-card/popup-details-dossier/PopupDetailsDossier";
import PopupAddDossier from "../../../components/dossier-card/popup-add-dossier/PopupAddDossier";

const Dossier = () => {
  const [groupSelector, setGroupSelector] = useState(1);
  const [groupSelectorData, setGroupSelectorData] = useState("monos");
  const [selectedMember, setSelectedMember] = useState(null);
  const [popupDetailsMember, setPopupDetailsMember] = useState(false);
  const [popupAddMember, setPopupAddMember] = useState(false);
  const [filteredByName, setFilteredByName] = useState([]);

  const [jeunes, setJeunes] = useState([]);
  const [monos, setMonos] = useState([]);

  function toggleGroup() {
    if (groupSelector > 2) {
      setGroupSelector(1);
    } else {
      setGroupSelector(groupSelector + 1);
    }
  }

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  const decryptField = (field) => {
    if (!field) return "";
    const bytes = CryptoJS.AES.decrypt(field, commonPass);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (groupSelector === 1) {
      setGroupSelectorData("monos");
    } else if (groupSelector === 2) {
      setGroupSelectorData("gg");
    } else if (groupSelector === 3) {
      setGroupSelectorData("mini-gg");
    }
  }, [groupSelector]);

  const [dossier, setDossier] = useState([]);

  const { database } = FirebaseConfig();

  const handleFetchData = () => {
    const snapshotDossierJeunesGG = ref(database, `dossiers/gg`);
    const snapshotDossierJeunesMiniGG = ref(database, `dossiers/mini-gg`);
    const snapshotDossierMonosGG = ref(database, `dossiers/monos`);
    const snapshotDossierMonosMiniGG = ref(database, `monos/monos`);

    const fetchData = async () => {
      try {
        const dataDossierJeunesGG =
          (await get(snapshotDossierJeunesGG)).val() || {};
        const dataDossierJeunesMiniGG =
          (await get(snapshotDossierJeunesMiniGG)).val() || {};
        const dataDossierMonosGG =
          (await get(snapshotDossierMonosGG)).val() || {};
        const dataDossierMonosMiniGG =
          (await get(snapshotDossierMonosMiniGG)).val() || {};

        const dataArrayJeunesGG = Object.values(dataDossierJeunesGG);
        const dataArrayJeunesMiniGG = Object.values(dataDossierJeunesMiniGG);
        const dataArrayMonosGG = Object.values(dataDossierMonosGG);
        const dataArrayMonosMiniGG = Object.values(dataDossierMonosMiniGG);

        setJeunes([...dataArrayJeunesGG, ...dataArrayJeunesMiniGG]);
        setMonos([...dataArrayMonosGG, ...dataArrayMonosMiniGG]);

        let filteredData = [];

        if (groupSelector === 1) {
          filteredData = [...dataArrayMonosGG, ...dataArrayMonosMiniGG];
        } else if (groupSelector === 2) {
          filteredData = dataArrayJeunesGG;
        } else if (groupSelector === 3) {
          filteredData = dataArrayJeunesMiniGG;
        }
        setFilteredByName(filteredData);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error.message);
      }
    };
    fetchData();
  };

  useEffect(() => {
    handleFetchData();
  }, [database, groupSelector]);

  const handleDetailsClick = (member) => {
    setSelectedMember(member);
    setPopupDetailsMember(true);
  };

  const handleDeleteClick = async (dossierToDelete) => {
    try {
      const dossierRef = ref(
        database,
        `dossiers/${groupSelectorData}/${dossierToDelete.dossierOwner}`
      );

      await remove(dossierRef);

      const updatedDossier = dossier.filter((item) => item !== dossierToDelete);
      setDossier(updatedDossier);
    } catch (error) {
      console.error("Error deleting dossier from Firebase:", error.message);
    }
  };

  const onCloseAddDossier = () => {
    setPopupAddMember(false);
    handleFetchData();
  };

  const onCloseDeleteDossier = () => {
    setPopupDetailsMember(false);
    handleDeleteClick(selectedMember);
    handleFetchData();
  };

  const onCloseBackArrow = () => {
    setPopupDetailsMember(false);
    handleFetchData();
  };

  return (
    <div className="dossierMainContainer">
      <div className="dossierTop">
        <div className="dossierTopIcon"></div>
        <p className="dossierTopTitle">Gestion</p>

        <p className="dossierTopSubtitle">dossier</p>
        <div className="dossierSlideContainer" onClick={toggleGroup}>
          <div
            className={`dossierSlider ${
              groupSelector === 1
                ? "monos-selected-dossier"
                : groupSelector === 2
                ? "gg-selected-dossier"
                : groupSelector === 3
                ? "mini-gg-selected-dossier"
                : ""
            }`}
          >
            {groupSelector === 1
              ? "monos"
              : groupSelector === 2
              ? "gg"
              : groupSelector === 3
              ? "mini-gg"
              : ""}
          </div>
        </div>
      </div>
      <div className="dossierBottom">
        {popupDetailsMember && (
          <PopupDetailsDossier
            member={selectedMember}
            groupSelectorData={groupSelectorData}
            onDelete={() => onCloseDeleteDossier()}
            backArrowFunction={() => onCloseBackArrow()}
          />
        )}
        {popupAddMember && (
          <PopupAddDossier
            groupSelectorData={groupSelectorData}
            decryptField={decryptField}
            onClose={() => onCloseAddDossier()}
            backArrowFunction={() => setPopupAddMember(false)}
          />
        )}
        <button
          className="dossierBtnAdd"
          onClick={() => setPopupAddMember(true)}
        >
          Ajouter un dossier
        </button>
        <p className="subtitle">
          Dossiers{" "}
          {groupSelector === 1
            ? "monos"
            : groupSelector === 2
            ? "gg"
            : groupSelector === 3
            ? "mini-gg"
            : ""}
        </p>
        <div className="dossierMemberCardContainer">
          {filteredByName.map((dossier, index) => (
            <DossierCard
              key={index}
              haveButton={true}
              buttonTitle={"détails"}
              memberName={dossier.dossierOwner}
              filesOnDossier={dossier.dossierElements.length}
              seeFile={true}
              filesAvaible={"4"}
              onClickFunction={() => handleDetailsClick(dossier)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dossier;
