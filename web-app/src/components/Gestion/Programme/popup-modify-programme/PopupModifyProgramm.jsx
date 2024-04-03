import React, { useEffect, useState } from "react";

import { ref, get, update, onValue } from "firebase/database";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import CryptoJS from "crypto-js";

import VehiculeCard from "../../../vehicule-card/VehiculeCard";
import ActivityCard from "../../../activity-card/ActivityCard";
import MultiSelect from "../../../multi-select/MultiSelect";

import "./PopupModifyProgramm.css";
import BackArrow from "../../../back-arrow/BackArrow";
import FirebaseConfig from "../../../../firebase/FirebaseConfig";
import UploadImage from "../../../UploadImage/UploadImage";

import { RiCloseFill } from "react-icons/ri";

const PopupModifyProgramm = ({ eventId, coordonnees, backArrowFunction }) => {
  const [needVehicule, setNeedVehicule] = useState(false);
  const [addVehicule, setAddVehicule] = useState(false);
  const [manageInscription, setManageInscription] = useState(false);
  const [jeunesGroup, setJeunesGroup] = useState("");
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
        console.log("allMonosDecrypted", decryptedMonos);
      } catch (error) {
        console.error("Error decrypting monos:", error);
      }
    };

    decryptMonos();
  }, [allMonos]);

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  const [hasSentAnImage, setHasSentAnImage] = useState(null);

  const [eventDataToUpdate, setEventDataToUpdate] = useState({
    id: null,
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
    jeunesGG: [],
    jeunesMiniGG: [],
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

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const eventRef = ref(database, `evenements/${eventId}`);
        const snapshot = await get(eventRef);

        if (snapshot.exists()) {
          const eventToModify = snapshot.val();

          setEventDataToUpdate(eventToModify || {});
        }
      } catch (error) {
        console.error(
          "Error loading event data from Firestore:",
          error.message
        );
      }
    };

    if (eventId) {
      loadEventData();
    }
  }, [eventId]);

  const handleInputChange = (field, value) => {
    setEventDataToUpdate((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (key, selected) => {
    const decryptedValues = selected.map((encryptedValue) => {
      if (!encryptedValue) return "";
      const bytes = CryptoJS.AES.decrypt(encryptedValue, commonPass);
      return bytes.toString(CryptoJS.enc.Utf8);
    });
    setEventDataToUpdate({
      ...eventDataToUpdate,
      [key]: decryptedValues,
    });
  };

  const saveEventChanges = async () => {
    try {
      const eventRef = ref(database, `evenements/${eventId}`);

      await update(eventRef, {
        prix: eventDataToUpdate.prix,
        lieu: eventDataToUpdate.lieu,
        nom: eventDataToUpdate.nom,
        manager: eventDataToUpdate.manager,
        date: eventDataToUpdate.date,
        horaire: eventDataToUpdate.horaire,
        absents: eventDataToUpdate.absents,
        jeunesGG: eventDataToUpdate.jeunesGG,
        jeunesMiniGG: eventDataToUpdate.jeunesMiniGG,
        etude: eventDataToUpdate.etude,
        equipeAccueil: eventDataToUpdate.equipeAccueil,
        equipeStaffGG: eventDataToUpdate.equipeStaffGG,
        equipeStaffMiniGG: eventDataToUpdate.equipeStaffMiniGG,
        equipeJeuxGG: eventDataToUpdate.equipeJeuxGG,
        equipeJeuxMiniGG: eventDataToUpdate.equipeJeuxMiniGG,
        equipeGouter: eventDataToUpdate.equipeGouter,
        equipeLouange: eventDataToUpdate.equipeLouange,
        vehicules: eventDataToUpdate.vehicules || [],
        activites: eventDataToUpdate.activites || [],
        coordonnees: position,
      });

      console.log("Modifications enregistrées avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des modifications :",
        error.message
      );
    }

    window.location.reload(true);
  };

  const handleAddActivite = () => {
    if (selectedActivite) {
      setEventDataToUpdate((prevData) => ({
        ...prevData,
        activites: [...(prevData.activites || []), selectedActivite],
      }));
      setSelectedActivite("");
    }
  };

  const removeActivity = (index) => {
    setEventDataToUpdate((prevData) => {
      const updatedActivites = [...prevData.activites];
      updatedActivites.splice(index, 1);
      return {
        ...prevData,
        activites: updatedActivites,
      };
    });
  };

  useEffect(() => {
    setEventDataToUpdate({
      ...eventDataToUpdate,
      activites: activitesSelected,
    });
  }, [activitesSelected]);

  const addNewVehicule = () => {
    const updatedVehicules = [...(eventDataToUpdate.vehicules || [])];
    const selectedDriver = vehicules.find(
      (v) => v.vehicleOwner === newVehicule.vehicleOwner
    );

    updatedVehicules.push({
      ...newVehicule,
      vehicleFreeSeat: selectedDriver ? selectedDriver.vehicleFreeSeat : "",
    });

    setEventDataToUpdate((prevData) => ({
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
    const updatedVehicules = [...eventDataToUpdate.vehicules];
    updatedVehicules.splice(index, 1);
    setEventDataToUpdate((prevData) => ({
      ...prevData,
      vehicules: updatedVehicules,
    }));
    setNeedVehicule(false);
    setAddVehicule(false);
  };

  const [position, setPosition] = useState(coordonnees);
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
        eventDataToUpdate.lieu
      )}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setPosition([lat, lon]);
      setHide(false);
      setTimeout(() => {
        setHide(true);
      }, 10);
    } else {
      alert("Adresse non trouvée");
    }
  };

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

  const [imageUrls, setImageUrl] = useState([]);
  const [preview, setPreview] = useState(true);

  useEffect(() => {
    const imagesRef = ref(database, "images");
    const imagesListener = onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const filteredImages = Object.values(data)
          .filter((item) => item.eventId === eventId)
          .map((item) => item.imageUrl);

        setImageUrl(filteredImages);
      }
    });

    return () => {
      imagesListener();
    };
  }, [eventId]);

  return (
    <div
      className="PopupModifyProgrammMainContainer"
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
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            margin: "10px 0px 0px",
            padding: "0px 20px",
          }}
        ></div>
      </div>

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
            zoom={20}
            style={{ height: "420px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && (
              <Marker position={position} icon={customIcon}>
                <Popup>{position}</Popup>
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
              Modifier un <br />
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
            <label style={{ width: "50%", marginRight: "10px" }}>
              nom de l'événement
              <input
                value={eventDataToUpdate.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                style={{ width: "100%" }}
              ></input>
            </label>
            <label style={{ width: "50%" }}>
              lieu de l'événement
              <input
                value={eventDataToUpdate.lieu}
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
                  marginBottom: "20px",
                  marginLeft: "auto",
                  display: "block",
                }}
                type="button"
                onClick={handleSearch}
              >
                Rechercher
              </button>
            </label>
            <div
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  zIndex: preview ? 2 : -1,
                }}
              >
                {preview &&
                  imageUrls.map((image, index) => {
                    return (
                      <img
                        style={{
                          backgroundColor: "#F3F9FF",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                        src={image}
                        alt="img"
                        key={index}
                      />
                    );
                  })}
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    color: "white",
                    border: "none",
                    padding: "2px",
                    cursor: "pointer",
                    alignSelf: "flex-end",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                  }}
                >
                  <RiCloseFill
                    style={{
                      color: "#83ADFF",
                      fontWeight: "700",
                    }}
                    size={30}
                  />
                </button>
              </div>

              <UploadImage
                eventId={eventId}
                hasPickedAnImage={() => setHasSentAnImage(false)}
                hasSentAnImage={() => setHasSentAnImage(true)}
                hasSentAnImageStatus={hasSentAnImage}
              />
            </div>

            <div className="line">
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
                    value={eventDataToUpdate.prix}
                    onChange={(e) => handleInputChange("prix", e.target.value)}
                    style={{ width: "100%" }}
                  ></input>
                </label>
                <label style={{ width: "50%" }}>
                  manager
                  <div className="popupModifyProgrammSelectContainer">
                    <select
                      style={{
                        width: "100%",
                        marginRight: "10px",
                        height: "50px",
                      }}
                      value={eventDataToUpdate.manager}
                      onChange={(e) =>
                        handleInputChange("manager", e.target.value)
                      }
                    >
                      <option>Choisir un mono</option>
                      {allMonosDecrypted.map((mono) => (
                        <option>{mono.additionalInfo.monoFirstName}</option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            </div>
            <div className="line"></div>
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
                    value={eventDataToUpdate.date.dateDay}
                    onChange={(e) =>
                      handleInputChange("date", {
                        ...eventDataToUpdate.date,
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
                    value={eventDataToUpdate.date.dateMonth}
                    onChange={(e) =>
                      handleInputChange("date", {
                        ...eventDataToUpdate.date,
                        dateMonth: e.target.value,
                      })
                    }
                  >
                    {months.map((month) => (
                      <option>{month}</option>
                    ))}
                  </select>
                  <select
                    value={eventDataToUpdate.date.dateYear}
                    onChange={(e) =>
                      handleInputChange("date", {
                        ...eventDataToUpdate.date,
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
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={1}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.absents.map(
                      (absent, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {absent}
                        </p>
                      )
                    )}
                  />
                </div>
              </label>
              <label style={{ width: "48%" }}>
                horaire
                <div className="popupModifyProgrammSelectContainer">
                  <input
                    style={{
                      width: "50%",
                      borderRadius: "40px",
                    }}
                    value={eventDataToUpdate.horaire.start}
                    onChange={(e) =>
                      handleInputChange("horaire", {
                        ...eventDataToUpdate.horaire,
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
                  <input
                    style={{
                      width: "50%",
                      borderRadius: "40px",
                    }}
                    value={eventDataToUpdate.horaire.end}
                    onChange={(e) =>
                      handleInputChange("horaire", {
                        ...eventDataToUpdate.horaire,
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
                  value={eventDataToUpdate.etude.titre}
                  onChange={(e) =>
                    handleMultiSelectChange("etude", {
                      ...eventDataToUpdate.etude,
                      titre: e.target.value,
                    })
                  }
                ></input>
                <div
                  className="popupModifyProgrammSelectContainer"
                  style={{ marginTop: "10px" }}
                >
                  <select
                    style={{
                      width: "100%",
                      marginRight: "10px",
                      height: "50px",
                    }}
                    value={eventDataToUpdate.etude.orateur}
                    onChange={(e) =>
                      handleMultiSelectChange("etude", {
                        ...eventDataToUpdate.etude,
                        orateur: e.target.value,
                      })
                    }
                  >
                    <option>Choisir un mono</option>
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
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={2}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.equipeAccueil.map(
                      (accueil, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {accueil}
                        </p>
                      )
                    )}
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
                      handleMultiSelectChange("jeuxGG", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={3}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.equipeJeuxGG.map(
                      (mono, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {mono}
                        </p>
                      )
                    )}
                  />
                </div>
              </label>
              <label style={{ width: "48%" }}>
                jeux mini-GG
                <div className="blocTypeSelectMono">
                  <MultiSelect
                    options={monosMiniGG}
                    onSelect={(selected) =>
                      handleMultiSelectChange("jeuxMiniGG", selected)
                    }
                    storageKey={"monos"}
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={4}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.equipeJeuxMiniGG.map(
                      (mono, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {mono}
                        </p>
                      )
                    )}
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
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={3}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.equipeStaffGG.map(
                      (mono, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {mono}
                        </p>
                      )
                    )}
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
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={4}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.equipeStaffMiniGG.map(
                      (mono, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {mono}
                        </p>
                      )
                    )}
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
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={5}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.equipeGouter.map(
                      (mono, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {mono}
                        </p>
                      )
                    )}
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
                    dataWanted={"monoName"}
                    hexaBackground={"#cfe0fd"}
                    dataValueLocalStorage={"test"}
                    onSameForm={true}
                    multiSelectNumber={6}
                    needFlexWrap={true}
                    elementOnLocalStorage={eventDataToUpdate.equipeLouange.map(
                      (mono, index) => (
                        <p className="blocTypeSelectMonoPastille" key={index}>
                          {mono}
                        </p>
                      )
                    )}
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
                      <div className="PopupModifyProgrammVehiculeContainer">
                        {eventDataToUpdate.vehicules &&
                        eventDataToUpdate.vehicules.length > 0 ? (
                          eventDataToUpdate.vehicules.map((vehicule, index) => (
                            <VehiculeCard
                              key={index}
                              driverName={vehicule.vehicleOwner}
                              haveButton={false}
                              haveErase={true}
                              bookedPlace={vehicule.jeuneFirstName.length}
                              seeBookedPlace={true}
                              nbrPlaceAvailable={vehicule.vehicleFreeSeat}
                              buttonTitle={"Gérer"}
                              onClickRemoveVehicule={() =>
                                removeVehicule(index)
                              }
                            />
                          ))
                        ) : (
                          <p style={{ margin: "auto" }}>
                            Aucun véhicule disponible de saisis
                          </p>
                        )}
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
                  className="popupModifyProgrammSelectContainer"
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
                {eventDataToUpdate.activites &&
                eventDataToUpdate.activites.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      overflowX: "scroll",
                      width: "100%",
                      margin: "20px 0px",
                    }}
                  >
                    {eventDataToUpdate.activites.map((activity, index) => (
                      <ActivityCard
                        key={index}
                        activityName={activity}
                        haveErase={true}
                        onClickRemoveActivity={() => removeActivity(activity)}
                      />
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: "20px auto" }}>
                    Aucune activités de saisies
                  </p>
                )}
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={saveEventChanges}
            style={{
              padding: "20px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#c6253d",
              fontSize: "1.2rem",
              display: "block",
              margin: "auto",
              color: "white",
              fontWeight: "600",
            }}
          >
            Modifier l'événement
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupModifyProgramm;
