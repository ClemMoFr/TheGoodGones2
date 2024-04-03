import React, { useEffect, useState, useRef } from "react";
import { ref, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import CryptoJS from "crypto-js";

import "./PopupAddProgramm.css";

import VehiculeCard from "../../../vehicule-card/VehiculeCard";
import ActivityCard from "../../../activity-card/ActivityCard";
import MultiSelect from "../../../multi-select/MultiSelect";
import BackArrow from "../../../back-arrow/BackArrow";
import FirebaseConfig from "../../../../firebase/FirebaseConfig";
import UploadImage from "../../../UploadImage/UploadImage";

const PopupAddProgramm = ({ backArrowFunction }) => {
  const [needVehicule, setNeedVehicule] = useState(false);
  const [addVehicule, setAddVehicule] = useState(false);
  const [manageInscription, setManageInscription] = useState(false);
  const [jeunesGroup, setJeunesGroup] = useState("");

  const [hasSentAnImage, setHasSentAnImage] = useState(null);

  const [jeunes, setJeunes] = useState([]);
  const [allMonos, setAllMonos] = useState([]);
  const [allMonosDecrypted, setAllMonosDecrypted] = useState([]);
  const [monosGG, setMonosGG] = useState([]);
  const [monosMiniGG, setMonosMiniGG] = useState([]);
  const [activites, setActivites] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [activitesSelected, setActivitesSelected] = useState([]);
  const [selectedActivite, setSelectedActivite] = useState("");
  const [newVehicule, setNewVehicule] = useState({
    vehicleOwner: "",
  });

  const { database } = FirebaseConfig();

  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, commonPass);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting data:", error);
      return null;
    }
  };

  useEffect(() => {
    const decryptData = async (encryptedData) => {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, commonPass);
        return bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Error decrypting data:", error);
        return null;
      }
    };
    // faire le meme useffect mais pour le modify
    const fetchData = async () => {
      try {
        const dataJeunesGG =
          (await get(ref(database, `jeunes/gg`))).val() || {};
        const dataJeunesMiniGG =
          (await get(ref(database, `jeunes/mini-gg`))).val() || {};
        const dataMonosGG = (await get(ref(database, `monos/gg`))).val() || {};
        const dataMonosMiniGG =
          (await get(ref(database, `monos/mini-gg`))).val() || {};
        const dataActivites =
          (await get(ref(database, `activites/`))).val() || {};
        const dataVehicules =
          (await get(ref(database, `vehicules/`))).val() || {};

        const dataArrayJeunesGG = Object.values(dataJeunesGG);
        const dataArrayJeunesMiniGG = Object.values(dataJeunesMiniGG);
        const dataArrayMonosGG = Object.values(dataMonosGG);
        const dataArrayMonosMiniGG = Object.values(dataMonosMiniGG);
        const dataArrayActivites = Object.values(dataActivites);
        const dataArrayVehicules = Object.values(dataVehicules);

        setJeunes([...dataArrayJeunesGG, ...dataArrayJeunesMiniGG]);
        setAllMonos([...dataArrayMonosGG, ...dataArrayMonosMiniGG]);
        setMonosGG([...dataArrayMonosGG]);
        setMonosMiniGG([...dataArrayMonosMiniGG]);
        setActivites([...dataArrayActivites]);
        setVehicules([...dataArrayVehicules]);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const decryptMonos = async () => {
      try {
        const decryptedMonos = await Promise.all(
          allMonos.map(async (mono) => {
            if (mono.additionalInfo && mono.additionalInfo.monoFirstName) {
              return {
                ...mono,
                additionalInfo: {
                  ...mono.additionalInfo,
                  monoFirstName: await decryptData(
                    mono.additionalInfo.monoFirstName
                  ),
                },
              };
            }
            return mono;
          })
        );

        setAllMonosDecrypted(decryptedMonos);
      } catch (error) {
        console.error("Error decrypting monos:", error);
      }
    };

    decryptMonos();
  }, [allMonos]);

  const [position, setPosition] = useState([45.75, 4.85]);
  const [zoom, setZoom] = useState(12);
  const [hide, setHide] = useState(true);

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const handleSearch = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        eventData.lieu
      )}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setPosition([lat, lon]);
      setZoom(20);
      setHide(false);
      setTimeout(() => {
        setHide(true);
      }, 10);
    } else {
      alert("Adresse non trouvée");
    }
  };

  const eventId = uuidv4();

  const [eventData, setEventData] = useState({
    id: eventId,
    prix: 0,
    lieu: "",
    nom: "",
    manager: "",
    date: {
      dateDay: "",
      dateMonth: "",
      dateYear: "",
    },
    horaire: {
      start: "",
      end: "",
    },
    absents: [],
    jeunesGG: ["Aucun"],
    jeunesMiniGG: ["Aucun"],
    etude: {
      titre: "",
      orateur: "",
    },
    equipeAccueil: [],
    equipeJeuxGG: [],
    equipeJeuxMiniGG: [],
    equipeStaffGG: [],
    equipeStaffMiniGG: [],
    equipeGouter: [],
    equipeLouange: [],
    vehicules: [],
    activites: [],
  });

  const handleInputChange = (key, value) => {
    setEventData({
      ...eventData,
      [key]: value,
    });
  };

  const isAnyFieldEmpty =
    eventData.equipeAccueil.length === 0 ||
    eventData.equipeJeuxGG.length === 0 ||
    eventData.equipeJeuxMiniGG.length === 0 ||
    eventData.equipeStaffGG.length === 0 ||
    eventData.equipeStaffMiniGG.length === 0 ||
    eventData.equipeGouter.length === 0 ||
    eventData.equipeLouange.length === 0 ||
    eventData.absents.length === 0;

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  const handleMultiSelectChange = (key, selectedMonos) => {
    const decryptedValues = selectedMonos.map((encryptedValue) => {
      if (!encryptedValue) return "";
      const bytes = CryptoJS.AES.decrypt(encryptedValue, commonPass);
      return bytes.toString(CryptoJS.enc.Utf8);
    });

    setEventData((prevData) => ({
      ...prevData,
      [key]: decryptedValues,
    }));
  };

  const handleAddActivite = () => {
    if (selectedActivite) {
      const updatedActivites = [...activitesSelected];
      updatedActivites.push(selectedActivite);
      setActivitesSelected(updatedActivites);
      setSelectedActivite("");
    }
  };

  const removeActivity = (index) => {
    const updatedActivites = [...activitesSelected];
    updatedActivites.splice(index, 1);
    setActivitesSelected(updatedActivites);
  };

  const addNewVehicule = () => {
    const updatedVehicules = [...eventData.vehicules];
    const selectedDriver = vehicules.find(
      (v) => v.vehicleOwner === newVehicule.vehicleOwner
    );

    updatedVehicules.push({
      ...newVehicule,
      vehicleFreeSeat: selectedDriver ? selectedDriver.vehicleFreeSeat : "",
    });

    setEventData((prevData) => ({
      ...prevData,
      vehicules: updatedVehicules,
    }));

    setNewVehicule({
      vehicleOwner: "",
      jeuneFirstName: "",
      vehicleFreeSeat: "",
    });

    setAddVehicule(false);
  };

  const removeVehicule = (index) => {
    const updatedVehicules = [...eventData.vehicules];
    updatedVehicules.splice(index, 1);
    setEventData((prevData) => ({
      ...prevData,
      vehicules: updatedVehicules,
    }));
    setNeedVehicule(false);
  };

  useEffect(() => {
    setEventData({
      ...eventData,
      activites: activitesSelected,
    });
  }, [activitesSelected]);

  const days = [
    "Jour",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];

  const months = [
    "Mois",
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const years = [
    "Année",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
  ];

  const createEvent = () => {
    const programmStatus = false;
    const jeunesInscrits = ["Aucun"];
    set(ref(database, `evenements/${eventData.id}`), {
      id: eventData.id,
      prix: eventData.prix || "non renseigné",
      lieu: eventData.lieu || "non renseigné",
      nom: eventData.nom || "non renseigné",
      manager: eventData.manager || "non renseigné",
      date: eventData.date || "non renseigné",
      horaire: eventData.horaire || "non renseigné",
      absents: eventData.absents || "non renseigné",
      jeunesGG: eventData.jeunesGG || "non renseigné",
      jeunesMiniGG: eventData.jeunesMiniGG || "non renseigné",
      etude: eventData.etude || "non renseigné",
      equipeAccueil: eventData.equipeAccueil || "non renseigné",
      equipeStaffGG: eventData.equipeStaffGG || "non renseigné",
      equipeStaffMiniGG: eventData.equipeStaffMiniGG || "non renseigné",
      equipeJeuxGG: eventData.equipeJeuxGG || "non renseigné",
      equipeJeuxMiniGG: eventData.equipeJeuxMiniGG || "non renseigné",
      equipeGouter: eventData.equipeGouter || "non renseigné",
      equipeLouange: eventData.equipeLouange || "non renseigné",
      vehicules: eventData.vehicules || "non renseigné",
      activites: eventData.activites || "non renseigné",
      programmStatus: programmStatus,
      jeunesInscrits: jeunesInscrits,
      coordonnees: position,
    });

    backArrowFunction();
  };

  return (
    <div
      className="PopupAddProgrammMainContainer"
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "flex-end",
        paddingBottom: "70px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "50vh",
          backgroundColor: "#ecf5ff",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "1",
        }}
      >
        {hide && (
          <MapContainer
            center={position}
            zoom={zoom}
            style={{ height: "420px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && (
              <Marker position={position} icon={customIcon}>
                <Popup>{eventData.lieu}</Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>

      <div
        style={{
          zIndex: "1",
          backgroundColor: "#FBFDFF",
          height: "50vh",
          borderRadius: "30px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            margin: "10px 0px 0px",
            padding: "0px 20px",
          }}
        >
          <p className="popupAddTitleJeune">
            <p>
              Ajouter un <br />
              événement
            </p>
          </p>
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"absolute"}
            xPosition={"30px"}
            yPosition={"0px"}
            icon={"arrow"}
          />
        </div>
        <form>
          <div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ width: "100%" }}>
                nom de l'événement
                <input
                  value={eventData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  style={{ width: "100%" }}
                ></input>
              </label>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ width: "100%" }}>
                lieu de l'événement
                <input
                  value={eventData.lieu}
                  onChange={(e) => handleInputChange("lieu", e.target.value)}
                  style={{ width: "100%" }}
                ></input>
                <button
                  style={{
                    padding: "10px 8px",
                    border: "none",
                    backgroundColor: "#83adff",
                    borderRadius: "5px",
                    color: "white",
                    fontWeight: "600",
                    marginTop: "10px",
                    marginLeft: "auto",
                    display: "block",
                  }}
                  type="button"
                  onClick={handleSearch}
                >
                  Rechercher
                </button>
              </label>
            </div>

            <UploadImage
              eventId={eventData.id}
              hasPickedAnImage={() => setHasSentAnImage(false)}
              hasSentAnImage={() => setHasSentAnImage(true)}
              hasSentAnImageStatus={hasSentAnImage}
            />

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                marginTop: "10px",
              }}
            >
              <label style={{ width: "50%", marginRight: "10px" }}>
                prix (si il y a)
                <input
                  value={eventData.prix}
                  onChange={(e) => handleInputChange("prix", e.target.value)}
                  style={{ width: "100%" }}
                ></input>
              </label>
              <label style={{ width: "50%" }}>
                manager
                <div className="popupAddProgrammSelectContainer">
                  <select
                    style={{
                      width: "100%",
                      marginRight: "10px",
                      height: "50px",
                    }}
                    value={eventData.manager}
                    onChange={(e) =>
                      handleInputChange("manager", e.target.value)
                    }
                  >
                    <option value="">Choisir un mono</option>
                    {allMonosDecrypted.map((mono) => (
                      <option key={mono.id} value={mono.id}>
                        {mono.additionalInfo.monoFirstName}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
            <div className="line">
              <label style={{ width: "100%", marginRight: "10px" }}>
                date de l’événement
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <select
                    style={{
                      width: "25%",
                      height: "50px",
                      marginRight: "10px",
                      borderRadius: "40px",
                      backgroundColor: "#e7f0ff",
                      border: "none",
                      fontWeight: "700",
                      paddingLeft: "20px",
                      color: "#b5d6ff",
                    }}
                    value={eventData.date.dateDay}
                    onChange={(e) =>
                      handleInputChange("date", {
                        ...eventData.date,
                        dateDay: e.target.value,
                      })
                    }
                  >
                    {days.map((day) => (
                      <option>{day}</option>
                    ))}
                  </select>
                  <select
                    style={{
                      width: "25%",
                      marginRight: "10px",
                      borderRadius: "40px",
                      backgroundColor: "#e7f0ff",
                      border: "none",
                      fontWeight: "700",
                      paddingLeft: "20px",
                      color: "#b5d6ff",
                    }}
                    value={eventData.date.dateMonth}
                    onChange={(e) =>
                      handleInputChange("date", {
                        ...eventData.date,
                        dateMonth: e.target.value,
                      })
                    }
                  >
                    {months.map((month) => (
                      <option>{month}</option>
                    ))}
                  </select>
                  <select
                    value={eventData.date.dateYear}
                    onChange={(e) =>
                      handleInputChange("date", {
                        ...eventData.date,
                        dateYear: e.target.value,
                      })
                    }
                    style={{
                      width: "50%",
                      borderRadius: "40px",
                      backgroundColor: "#e7f0ff",
                      border: "none",
                      fontWeight: "700",
                      paddingLeft: "20px",
                      color: "#b5d6ff",
                    }}
                  >
                    {years.map((year) => (
                      <option>{year}</option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
            <div className="line">
              <label style={{ width: "48%" }}>
                absent
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={allMonos}
                    onSelect={(selected) =>
                      handleMultiSelectChange("absents", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={1}
                    needFlexWrap={true}
                  />
                </div>
              </label>
              <label style={{ width: "48%" }}>
                horaire
                <div className="popupAddProgrammSelectContainer">
                  <span style={{ marginRight: "5px" }}> De</span>
                  <input
                    style={{
                      width: "50%",
                      borderRadius: "40px",
                    }}
                    value={eventData.horaire.start}
                    onChange={(e) =>
                      handleInputChange("horaire", {
                        ...eventData.horaire,
                        start: e.target.value,
                      })
                    }
                  ></input>
                  <span
                    style={{
                      margin: "0px 5px",
                      borderRadius: "40px",
                    }}
                  >
                    h
                  </span>
                  <span
                    style={{
                      marginRight: "5px",
                    }}
                  >
                    à
                  </span>
                  <input
                    style={{
                      width: "50%",
                      borderRadius: "40px",
                      marginRight: "5px",
                    }}
                    value={eventData.horaire.end}
                    onChange={(e) =>
                      handleInputChange("horaire", {
                        ...eventData.horaire,
                        end: e.target.value,
                      })
                    }
                  ></input>
                  h
                </div>
              </label>
            </div>
            <div className="line">
              <label style={{ width: "48%" }}>
                etude
                <input
                  style={{ width: "100%" }}
                  value={eventData.etude.titre}
                  onChange={(e) =>
                    handleInputChange("etude", {
                      ...eventData.etude,
                      titre: e.target.value,
                    })
                  }
                ></input>
                <div
                  className="popupAddProgrammSelectContainer"
                  style={{ marginTop: "10px" }}
                >
                  <select
                    style={{
                      width: "100%",
                      marginRight: "10px",
                      height: "50px",
                    }}
                    value={eventData.etude.orateur}
                    onChange={(e) =>
                      handleInputChange("etude", {
                        ...eventData.etude,
                        orateur: e.target.value,
                      })
                    }
                  >
                    <option value="">Choisir un mono</option>
                    {allMonosDecrypted.map((mono) => (
                      <option>{mono.additionalInfo.monoFirstName}</option>
                    ))}
                  </select>
                </div>
              </label>
              <label style={{ width: "48%" }}>
                equipe accueil
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={allMonos}
                    onSelect={(selected) =>
                      handleMultiSelectChange("equipeAccueil", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={2}
                    needFlexWrap={true}
                  />
                </div>
              </label>
            </div>
            <div className="line">
              <label style={{ width: "48%" }}>
                jeux GG
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={monosGG}
                    onSelect={(selected) =>
                      handleMultiSelectChange("equipeJeuxGG", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={3}
                    needFlexWrap={true}
                  />
                </div>
              </label>
              <label style={{ width: "48%" }}>
                jeux mini-GG
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={monosMiniGG}
                    onSelect={(selected) =>
                      handleMultiSelectChange("equipeJeuxMiniGG", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={4}
                    needFlexWrap={true}
                  />
                </div>
              </label>
            </div>
            <div className="line">
              <label style={{ width: "48%" }}>
                staff GG
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={monosGG}
                    onSelect={(selected) =>
                      handleMultiSelectChange("equipeStaffGG", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={3}
                    needFlexWrap={true}
                  />
                </div>
              </label>
              <label style={{ width: "48%" }}>
                staff mini-GG
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={monosMiniGG}
                    onSelect={(selected) =>
                      handleMultiSelectChange("equipeStaffMiniGG", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={4}
                    needFlexWrap={true}
                  />
                </div>
              </label>
            </div>
            <div className="line">
              <label style={{ width: "48%" }}>
                equipe goûter
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={allMonos}
                    onSelect={(selected) =>
                      handleMultiSelectChange("equipeGouter", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={5}
                    needFlexWrap={true}
                  />
                </div>
              </label>
              <label style={{ width: "48%" }}>
                equipe louange
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={allMonos}
                    onSelect={(selected) =>
                      handleMultiSelectChange("equipeLouange", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoFirstName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={6}
                    needFlexWrap={true}
                  />
                </div>
              </label>
            </div>
            <label style={{ width: "100%" }}>
              véhicules
              <div
                className=""
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "20px",
                  backgroundColor: "#E7F0FF",
                }}
              >
                {needVehicule ? (
                  addVehicule ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <p style={{ width: "50%" }}>Voiture de : </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <select
                            style={{
                              width: "75%",
                              marginRight: "10px",
                              height: "50px",
                              backgroundColor: "#CFE0FD",
                              border: "none",
                              borderRadius: "40px",
                              width: "50%",
                              color: "white",
                              fontWeight: "700",
                              paddingLeft: "20px",
                            }}
                            value={newVehicule.vehicleOwner}
                            onChange={(e) =>
                              setNewVehicule({
                                ...newVehicule,
                                vehicleOwner: e.target.value,
                              })
                            }
                          >
                            <option>Choisir un conducteur</option>
                            {vehicules.map((vehicule, index) => (
                              <option key={index}>
                                {vehicule.vehicleOwner}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          backgroundColor: "#CFE0FD",
                          borderRadius: "20px",
                          marginTop: "20px",
                          padding: "20px",
                        }}
                      >
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <p style={{ width: "100%" }}>Passager : </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <MultiSelect
                              options={jeunes}
                              onSelect={(selected) =>
                                setNewVehicule({
                                  ...newVehicule,
                                  jeuneFirstName: selected,
                                })
                              }
                              storageKey={"jeunes"}
                              dataWanted={"jeuneFirstName"}
                              hexaBackground={"#87ace8"}
                              dataValueLocalStorage={"test"}
                              onSameForm={true}
                              multiSelectNumber={1}
                              needFlexWrap={false}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="PopupAddProgrammAddVehiculeButton"
                        style={{ marginTop: "20px" }}
                        onClick={addNewVehicule}
                      >
                        ajouter le véhicule
                      </button>
                    </div>
                  ) : (
                    <div style={{ width: "100%", paddingTop: "20px" }}>
                      <button
                        type="button"
                        className="PopupAddProgrammAddVehiculeButton"
                        onClick={() => setAddVehicule(true)}
                      >
                        ajouter un transport
                      </button>
                      <div className="PopupAddProgrammVehiculeContainer">
                        {eventData.vehicules.map((vehicule, index) => (
                          <VehiculeCard
                            driverName={vehicule.vehicleOwner}
                            haveButton={false}
                            haveErase={true}
                            bookedPlace={vehicule.jeuneFirstName.length}
                            seeBookedPlace={true}
                            nbrPlaceAvailable={vehicule.vehicleFreeSeat}
                            buttonTitle={"Gérer"}
                            onClickRemoveVehicule={removeVehicule}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <button
                    className="PopupAddProgrammAddVehiculeButton"
                    style={{ margin: "20px auto" }}
                    onClick={() => setNeedVehicule(true)}
                  >
                    Y'a t'il besoin d'un véhicule ?
                  </button>
                )}
              </div>
            </label>
            <label
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                margin: "20px 0px",
              }}
            >
              activités
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  borderRadius: "20px",
                  backgroundColor: "#e7f0ff",
                  padding: "10px",
                  flexDirection: "column",
                }}
              >
                <div
                  className="popupAddProgrammSelectContainer"
                  style={{ width: "80%" }}
                >
                  <select
                    style={{
                      width: "100%",
                      marginRight: "10px",
                      height: "50px",
                      backgroundColor: "#cfe0fd",
                    }}
                    value={selectedActivite}
                    onChange={(e) => setSelectedActivite(e.target.value)}
                  >
                    <option>Choisir une activitée</option>
                    {activites.map((activite) => (
                      <option key={activite.activitesTitle}>
                        {activite.activitesTitle}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      width: "30%",
                      height: "50px",
                      color: "#ffffff",
                      borderRadius: "40px",
                      backgroundColor: "#5590F2",
                      fontWeight: "700",
                      fontSize: "1rem",
                      border: "none",
                      padding: "0px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={handleAddActivite}
                  >
                    Ajouter
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    overflowX: "scroll",
                    width: "100%",
                    margin: "20px 0px",
                  }}
                >
                  {activitesSelected.map((activity, index) => (
                    <ActivityCard
                      key={index}
                      activityName={activity}
                      haveErase={true}
                      onClickRemoveActivity={() => removeActivity(index)}
                    />
                  ))}
                </div>
              </div>
            </label>
          </div>
          <button
            onClick={createEvent}
            style={{
              padding: "20px",
              borderRadius: "30px",
              border: "none",
              backgroundColor:
                hasSentAnImage === false || isAnyFieldEmpty
                  ? "#E5E5E5"
                  : "#c6253d",
              fontSize: "1.2rem",
              display: "block",
              margin: "auto",
              color: hasSentAnImage === false ? "#757575" : "white",
              fontWeight: "600",
              marginBottom: "10px",
            }}
            disabled={hasSentAnImage === false || isAnyFieldEmpty}
          >
            Créer l'événement
          </button>
          {hasSentAnImage === false && (
            <p style={{ color: "red" }}>Merci de valider l'image</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PopupAddProgramm;
