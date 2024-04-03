import React, { useEffect, useState } from "react";

import { ref, get, remove } from "firebase/database";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

import "./Contact.css";

import { BiSearch } from "react-icons/bi";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
import PopupDetailsContact from "../../../components/Gestion/Contact/popup-details-contact/PopupDetailsContact";
import PopupAddContact from "../../../components/Gestion/Contact/popup-add-contact/PopupAddContact";
import CryptoJS from "crypto-js";

const Contact = () => {
  const [popupDetailsPresence, setPopupDetailsPresence] = useState(false);
  const [popupDetailsFamilly, setPopupDetailsFamilly] = useState(false);
  const [popupAddContact, setPopupAddContact] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [groupSelector, setGroupSelector] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [jeunes, setJeunes] = useState([]);
  const [monos, setMonos] = useState([]);
  const [families, setFamilies] = useState([]);

  const { database } = FirebaseConfig();

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  const decryptField = (field) => {
    if (!field) return "";
    const bytes = CryptoJS.AES.decrypt(field, commonPass);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const snapshotJeunesGG = ref(database, `jeunes/gg`);
    const snapshotJeunesMiniGG = ref(database, `jeunes/mini-gg`);
    const snapshotMonosGG = ref(database, `monos/gg`);
    const snapshotMonosMiniGG = ref(database, `monos/mini-gg`);
    const snapshotFamilies = ref(database, `families`);

    const fetchData = async () => {
      try {
        const dataJeunesGG = (await get(snapshotJeunesGG)).val() || {};
        const dataJeunesMiniGG = (await get(snapshotJeunesMiniGG)).val() || {};
        const dataMonosGG = (await get(snapshotMonosGG)).val() || {};
        const dataMonosMiniGG = (await get(snapshotMonosMiniGG)).val() || {};
        const dataFamilies = (await get(snapshotFamilies)).val() || {};

        const dataArrayJeunesGG = Object.values(dataJeunesGG);
        const dataArrayJeunesMiniGG = Object.values(dataJeunesMiniGG);
        const dataArrayMonosGG = Object.values(dataMonosGG);
        const dataArrayMonosMiniGG = Object.values(dataMonosMiniGG);
        const dataArrayFamilies = Object.values(dataFamilies);

        setJeunes([...dataArrayJeunesGG, ...dataArrayJeunesMiniGG]);
        setMonos([...dataArrayMonosGG, ...dataArrayMonosMiniGG]);
        setFamilies(dataArrayFamilies);

        let filteredData = [];

        if (groupSelector === 1) {
          filteredData = [...dataArrayMonosGG, ...dataArrayMonosMiniGG];
        } else if (groupSelector === 2) {
          filteredData = dataArrayJeunesGG;
        } else if (groupSelector === 3) {
          filteredData = dataArrayJeunesMiniGG;
        } else if (groupSelector === 4) {
          filteredData = dataArrayFamilies;
        }
        setFilteredByName(filteredData);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error.message);
      }
    };
    fetchData();
  }, [database, groupSelector]);

  function toggleGroup() {
    if (groupSelector > 3) {
      setGroupSelector(1);
    } else {
      setGroupSelector(groupSelector + 1);
    }
  }

  const handleFilterByName = () => {
    let filteredList = [];

    if (groupSelector === 1) {
      filteredList = monos.filter((item) =>
        item.additionalInfo.monoFirstName
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    } else if (groupSelector === 2 || groupSelector === 3) {
      filteredList = jeunes.filter((item) =>
        item.additionalInfo.jeuneFirstName
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    } else if (groupSelector === 4) {
      filteredList = families.filter((item) =>
        item.familyName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredByName(filteredList);
  };

  const handleDeleteContact = async (id) => {
    try {
      const familyRef = ref(database, `families/${id}`);
      await remove(familyRef);
    } catch (error) {
      console.error("Error deleting family data:", error.message);
    }
  };

  const handleRefresh = async () => {
    try {
      const snapshotFamilies = ref(database, `families`);

      const dataFamilies = (await get(snapshotFamilies)).val() || {};

      const dataArrayFamilies = Object.values(dataFamilies);

      setFamilies(dataArrayFamilies);

      let filteredData = [];

      filteredData = dataArrayFamilies;

      setFilteredByName(filteredData);
    } catch (error) {
      console.error("Error fetching data from Firebase:", error.message);
    }
  };

  return (
    <>
      {!refresh && (
        <div className="contactMainContainer">
          <div className="contactTop">
            <div className="contactTopIcon"></div>
            <p className="contactTopTitle">Gestion</p>
            <p className="contactTopSubtitle">Contact</p>
            <div className="contactSlideContainer" onClick={toggleGroup}>
              <div
                className={`contactSlider ${
                  groupSelector === 1
                    ? "monos-selected-contact"
                    : groupSelector === 2
                    ? "gg-selected-contact"
                    : groupSelector === 3
                    ? "mini-gg-selected-contact"
                    : groupSelector === 4
                    ? "parents-selected-contact"
                    : ""
                }`}
              >
                {groupSelector === 1
                  ? "monos"
                  : groupSelector === 2
                  ? "gg"
                  : groupSelector === 3
                  ? "mini-gg"
                  : groupSelector === 4
                  ? "parents"
                  : ""}
              </div>
            </div>
          </div>

          {!popupDetailsPresence && (
            <div className="contactBottom">
              {popupAddContact && (
                <PopupAddContact
                  jeunesData={jeunes}
                  decryptField={decryptField}
                  handleRefreshFunction={handleRefresh}
                  backArrowFunction={() => setPopupAddContact(false)}
                />
              )}
              {popupDetailsFamilly && selectedFamily && (
                <PopupDetailsContact
                  familyId={selectedFamily.id}
                  familyName={selectedFamily.familyName}
                  familyAdress={selectedFamily.familyAdress}
                  familyFixPhone={selectedFamily.familyTelHome}
                  familyDadName={selectedFamily.familyParents.dad.name}
                  familyMailDad={selectedFamily.familyParents.dad.mail}
                  familyMobileDad={selectedFamily.familyParents.dad.tel}
                  familyMumName={selectedFamily.familyParents.mum.name}
                  familyMailMum={selectedFamily.familyParents.mum.mail}
                  familyMobileMum={selectedFamily.familyParents.mum.tel}
                  familleChildrens={selectedFamily.familyChildrens}
                  jeunesData={jeunes}
                  decryptField={decryptField}
                  handleRefreshFunction={handleRefresh}
                  onDelete={handleDeleteContact}
                  backArrowFunction={() => setPopupDetailsFamilly(false)}
                />
              )}
              {groupSelector === 4 && !popupDetailsFamilly && (
                <button
                  className="contactBtnAddFicheContact"
                  onClick={() => setPopupAddContact(true)}
                >
                  Ajouter une fiche de contact
                </button>
              )}
              <p className="subtitle">
                Contact{" "}
                {groupSelector === 1
                  ? "monos"
                  : groupSelector === 2
                  ? "gg"
                  : groupSelector === 3
                  ? "mini-gg"
                  : groupSelector === 4
                  ? "parents"
                  : ""}
              </p>
              {!popupDetailsFamilly && (
                <label className="seachBar">
                  <input
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <button onClick={handleFilterByName}>
                    <BiSearch />
                  </button>
                </label>
              )}

              {groupSelector === 4 ? (
                <div className="contactFamilyContainer">
                  {filteredByName.map((family, index) => (
                    <div className="contactFamilyCard" key={index}>
                      <FaChevronRight
                        style={{
                          position: "absolute",
                          top: "30px",
                          right: "30px",
                        }}
                        onClick={() => {
                          setPopupDetailsFamilly(true);
                          setSelectedFamily(family);
                        }}
                      />
                      <p className="contactFamilyName">
                        Famille {decryptField(family.familyName)}
                      </p>
                      <p className="contactTitle">
                        {family.familyChildrens &&
                        family.familyChildrens.length > 1
                          ? "enfants"
                          : "enfant"}
                      </p>
                      <div className="contactChildCardContainer">
                        {family.familyChildrens &&
                          family.familyChildrens.map((children, index) => (
                            <p className="contactChildCard" key={index}>
                              {children} {decryptField(family.familyName)}
                            </p>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="contactPersonContainer">
                  {filteredByName.map((personne, index) => (
                    <div className="contactPersonCard" key={index}>
                      <p style={{ fontSize: "1.4rem", fontWeight: "700" }}>
                        {personne.additionalInfo &&
                          (groupSelector === 1
                            ? decryptField(
                                personne.additionalInfo?.monoFirstName
                              )
                            : groupSelector === 2
                            ? decryptField(
                                personne.additionalInfo?.jeuneFirstName
                              )
                            : groupSelector === 3
                            ? decryptField(
                                personne.additionalInfo?.jeuneFirstName
                              )
                            : "")}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          margin: "10px 0px",
                        }}
                      >
                        <a
                          href={`tel:${
                            personne.additionalInfo?.monoMobile ||
                            personne.additionalInfo?.jeuneMobile
                          }`}
                        >
                          <BsFillTelephoneFill size={30} color="#c6253d" />
                        </a>
                        <p style={{ marginLeft: "10px" }}>
                          {personne.additionalInfo &&
                            (groupSelector === 1
                              ? decryptField(personne.additionalInfo.monoMobile)
                              : groupSelector === 2
                              ? decryptField(
                                  personne.additionalInfo.jeuneMobile
                                )
                              : groupSelector === 3
                              ? decryptField(
                                  personne.additionalInfo.jeuneMobile
                                )
                              : "")}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          margin: "10px 0px",
                        }}
                      >
                        <a
                          href={`mail:${
                            personne.additionalInfo?.email ||
                            personne.additionalInfo?.email
                          }`}
                        >
                          <IoMdMail size={30} color="#c6253d" />
                        </a>
                        <p style={{ marginLeft: "10px" }}>
                          {personne.additionalInfo &&
                            (groupSelector === 1
                              ? decryptField(personne.additionalInfo.email)
                              : groupSelector === 2
                              ? decryptField(personne.additionalInfo.email)
                              : groupSelector === 3
                              ? decryptField(personne.additionalInfo.email)
                              : "")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Contact;

// a faire : trad popup familly
