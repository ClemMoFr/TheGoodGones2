import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./PopupDetailsProgramm.css";

import CryptoJS from "crypto-js";

import VehiculeCard from "../../../vehicule-card/VehiculeCard";
import ActivityCard from "../../../activity-card/ActivityCard";
import BackArrow from "../../../back-arrow/BackArrow";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { FaPen, FaTrash, FaUserPlus } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";

import FirebaseConfig from "../../../../firebase/FirebaseConfig";
import {
  ref,
  set,
  get,
  push,
  update,
  onValue,
  remove,
} from "firebase/database";

const PopupDetailsProgramm = ({
  eventId,
  eventTitle,
  eventDay,
  eventMonth,
  eventHoraire,
  eventAccueil,
  eventLieu,
  eventManager,
  eventAbsent,
  eventGG,
  eventMiniGG,
  eventEtude,
  eventJeuxGG,
  eventJeuxMiniGG,
  eventStaffGG,
  eventStaffMiniGG,
  eventGouter,
  eventLouange,
  eventVehicules,
  eventActivity,
  eventJeunesInscrit,
  handleOpenModifyPopup,
  handleRemoveEvent,
  backArrowFunction,
  programmStatus,
  coordonnees,
}) => {
  const [messageDelete, setMessageDelete] = useState(false);

  const [btnsCtaAboutAndParticipants, setBtnsCtaAboutAndParticipants] =
    useState("about");

  const [btnsCtaEditAndRemove, setBtnsCtaEditAndRemove] = useState(false);

  const [loading, setLoading] = useState(false);

  const [jeunes, setJeunes] = useState([]);

  const { database } = FirebaseConfig();

  const [eventJeunesInscrits, setEventJeunesInscrits] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);

  const toggleBtnsCtaEditAndRemove = () => {
    setBtnsCtaEditAndRemove(!btnsCtaEditAndRemove);
  };

  useEffect(() => {
    const savedJeunes = JSON.parse(localStorage.getItem("jeunes")) || [];
    setJeunes(savedJeunes);
    setFilteredByName(savedJeunes);
    setSelectedPeople(savedJeunes.map(() => false));
  }, []);

  const sendEventInscription = (eventId) => {
    const activiteRef = ref(database, `evenements/${eventId}/programmStatus`);
    set(activiteRef, true)
      .then(() => {
        console.log("invitation envoyé !");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour de programmStatus:",
          error.message
        );
      });
  };

  const [imageUrls, setImageUrl] = useState([]);

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

  useEffect(() => {
    const dataRef = ref(database, `evenements/${eventId}/jeunesInscrits`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setEventJeunesInscrits(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setEventJeunesInscrits([]);
      }
    });
    return () => unsubscribe();
  }, [database]);

  const [formAddUserWhoIsNotInTheApp, setFormAddUserWhoIsNotInTheApp] =
    useState(false);
  const [jeuneOutAppFirstname, setJeuneOutAppFirstname] = useState("");
  const [jeuneOutAppLastname, setJeuneOutAppLastname] = useState("");
  const [jeuneOutAppOrigin, setJeuneOutAppOrigin] = useState("alien");
  const [showContent, setShowContent] = useState(false);

  const jeuneOutAppId = uuidv4();

  const addJeuneWhoIsNotOnTheApp = async () => {
    const eventRef = ref(
      database,
      `evenements/${eventId}/jeunesInscrits/${jeuneOutAppId}`
    );

    const jeuneData = {
      jeuneUid: jeuneOutAppId,
      jeuneOutAppFirstname: jeuneOutAppFirstname,
      jeuneOutAppLastname: jeuneOutAppLastname,
      jeuneOrigin: jeuneOutAppOrigin,
      isPresent: false,
    };

    set(eventRef, jeuneData);

    toggleFormAddUserWhoIsNotInTheApp();

    setJeuneOutAppOrigin("alien");
  };

  const toggleSelectedJeune = (jeuneUid) => {
    const updatedJeunesInscrit = { ...eventJeunesInscrit };
    const selectedJeune = updatedJeunesInscrit[jeuneUid];
    selectedJeune.isPresent = !selectedJeune.isPresent;
    setEventJeunesInscrits(updatedJeunesInscrit);
    const eventRef = ref(
      database,
      `evenements/${eventId}/jeunesInscrits/${jeuneUid}` ||
        `evenements/${eventId}/jeunesInscrits/${jeuneOutAppId}`
    );
    update(eventRef, { isPresent: selectedJeune.isPresent })
      .then(() => {
        console.log("Jeune mis à jour avec succès dans la base de données");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour du jeune dans la base de données:",
          error.message
        );
      });
  };

  function toggleFormAddUserWhoIsNotInTheApp() {
    setFormAddUserWhoIsNotInTheApp(!formAddUserWhoIsNotInTheApp);
    setShowContent(false);

    setJeuneOutAppFirstname("");
    setJeuneOutAppLastname("");

    setTimeout(() => {
      setShowContent(true);
    }, 1000);
  }

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

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;
  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, commonPass);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      //  console.error("Error decrypting data:", error);
      return null;
    }
  };

  return (
    <div>
      <div className="programmePopupDetailsMainContainer">
        {imageUrls.map((image, index) => {
          return (
            <img
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                backgroundColor: "#F3F9FF",
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
              src={image}
              alt="img"
              key={index}
            />
          );
        })}
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "rgba(0,0,0,0.8)",
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "30px",
          }}
        >
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"relative"}
            xPosition={"0px"}
            yPosition={"0px"}
            icon={"arrow"}
            color={"white"}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#c6253d",
            width: "70px",
            height: "70px",
            position: "absolute",
            top: "215px",
            right: "30px",
            borderRadius: "15px",
            fontWeight: "500",
            color: "white",
          }}
        >
          <p>{eventDay}</p>
          <p>
            {eventMonth && eventMonth.length >= 5
              ? eventMonth.substring(0, 3)
              : eventMonth}
          </p>
        </div>

        <p
          style={{
            marginTop: "20px",
            fontSize: "1.5rem",
            fontWeight: "700",
            width: "78%",
          }}
        >
          {eventTitle}
        </p>
        <p>
          De {eventHoraire.start}h à {eventHoraire.end}h
        </p>

        <div className="ctaAboutParticipants">
          <button
            className={
              btnsCtaAboutAndParticipants === "about"
                ? "btnsCtaAboutAndParticipantsActive"
                : "btnsCtaAboutAndParticipantsNotActive"
            }
            onClick={() => setBtnsCtaAboutAndParticipants("about")}
          >
            A propos
          </button>
          <button
            className={
              btnsCtaAboutAndParticipants === "participants"
                ? "btnsCtaAboutAndParticipantsActive"
                : "btnsCtaAboutAndParticipantsNotActive"
            }
            onClick={() => setBtnsCtaAboutAndParticipants("participants")}
          >
            Participants
          </button>
          {btnsCtaAboutAndParticipants === "about" && (
            <>
              {programmStatus ? (
                <p
                  className="sendInscriptionEvent"
                  style={{
                    cursor: "default",
                    backgroundColor: "#F3F9FF",
                    boxShadow: "none",
                    color: "#c6253d",
                  }}
                >
                  Invitation envoyée !
                </p>
              ) : (
                <button
                  type="button"
                  className="sendInscriptionEvent"
                  onClick={() => {
                    sendEventInscription(eventId);
                  }}
                >
                  Envoyer l’inscription
                </button>
              )}
            </>
          )}
        </div>

        {btnsCtaAboutAndParticipants === "about" && (
          <>
            <div className="programmePopupDetailsCardMainContainer">
              <p>
                Absent :{" "}
                {eventAbsent.map((absentPerson, index) => (
                  <span key={index}>{absentPerson}, </span>
                ))}
              </p>
              <p>Manager : {eventManager}</p>
              <div>
                <p>Localisation : {eventLieu}</p>
                <div className="test" style={{ overflow: "hidden" }}>
                  <MapContainer
                    center={coordonnees}
                    zoom={20}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {position && (
                      <Marker position={coordonnees} icon={customIcon}>
                        <Popup>{eventLieu}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Accueil</p>
                <div className="programmePopupDetailsMonoContainer">
                  {eventAccueil.map((monoAccueil) => (
                    <div className="programmePopupDetailsPastille">
                      {monoAccueil}
                    </div>
                  ))}
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Etude : {eventEtude.titre}</p>
                <div className="programmePopupDetailsMonoContainer">
                  <div className="programmePopupDetailsPastille">
                    {eventEtude.orateur}
                  </div>
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Staff</p>
                <p
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  GG
                </p>
                <div className="programmePopupDetailsMonoContainer">
                  {eventStaffGG.map((staffGG) => (
                    <div className="programmePopupDetailsPastille">
                      {staffGG}
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  MINI-GG
                </p>
                <div className="programmePopupDetailsMonoContainer">
                  {eventStaffMiniGG.map((staffMiniGG) => (
                    <div className="programmePopupDetailsPastille">
                      {staffMiniGG}
                    </div>
                  ))}
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Jeux</p>
                <p
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  GG
                </p>
                <div className="programmePopupDetailsMonoContainer">
                  {eventJeuxGG.map((jeuxGG) => (
                    <div className="programmePopupDetailsPastille">
                      {jeuxGG}
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  MINI-GG
                </p>
                <div className="programmePopupDetailsMonoContainer">
                  {eventJeuxMiniGG.map((jeuxMiniGG) => (
                    <div className="programmePopupDetailsPastille">
                      {jeuxMiniGG}
                    </div>
                  ))}
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Goûter</p>
                <div className="programmePopupDetailsMonoContainer">
                  {eventGouter.map((gouter) => (
                    <div className="programmePopupDetailsPastille">
                      {gouter}
                    </div>
                  ))}
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Louange</p>
                <div className="programmePopupDetailsMonoContainer">
                  {eventLouange.map((louange) => (
                    <div className="programmePopupDetailsPastille">
                      {louange}
                    </div>
                  ))}
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Véhicule</p>
                <div className="programmePopupDetailsVehiculeContainer">
                  {eventVehicules && eventVehicules.length > 0 ? (
                    eventVehicules.map((vehicule, index) => (
                      <VehiculeCard
                        key={index}
                        driverName={vehicule.vehicleOwner}
                        haveButton={false}
                        bookedPlace={vehicule.jeuneFirstName.length}
                        seeBookedPlace={true}
                        nbrPlaceAvailable={vehicule.vehicleFreeSeat}
                        buttonTitle={""}
                      />
                    ))
                  ) : (
                    <p>Pas de véhicule pour cet événement</p>
                  )}
                </div>
              </div>
              <div className="programmePopupDetailsCardContainer">
                <p>Activités</p>
                <div className="programmePopupDetailsVehiculeContainer">
                  {eventActivity && eventActivity.length > 0 ? (
                    eventActivity.map((activity, index) => (
                      <ActivityCard key={index} activityName={activity} />
                    ))
                  ) : (
                    <p>Pas d'activité pour cet événement</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {btnsCtaAboutAndParticipants === "participants" && (
          <>
            <label
              style={{
                display: "flex",
                margin: "10px auto 0px",
                justifyContent: "center",
              }}
            >
              <input
                value={searchName}
                style={{
                  borderRadius: "40px",
                  backgroundColor: "#FFF",
                  boxShadow: "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
                  height: "40px",
                  border: "none",
                  paddingLeft: "15px",
                  color: "rgba(203, 228, 255, 0.9)",
                  fontWeight: "900",
                  fontSize: "16px",
                  width: "70%",
                }}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <button
                style={{
                  borderRadius: "40px",
                  backgroundColor: "#FFF",
                  boxShadow: "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
                  border: "none",
                  height: "40px",
                  padding: "0px 15px",
                  marginLeft: "20px",
                }}
              >
                <BiSearch
                  color="#B5D6FF"
                  size={25}
                  style={{ marginLeft: "auto" }}
                />
              </button>
            </label>
            <div className="PopupDetailsPresencePersonContainer">
              {eventJeunesInscrits
                .filter(
                  (jeune) =>
                    jeune !== "Aucun" &&
                    (!searchName ||
                      (jeune.jeuneName || jeune.jeuneOutAppFirstname)
                        .toLowerCase()
                        .includes(searchName.toLowerCase()))
                )
                .sort((a, b) => {
                  if (a.jeuneName && b.jeuneName) {
                    // Si les deux ont un jeuneName, comparer les jeunesName
                    return a.jeuneName.localeCompare(b.jeuneName);
                  } else if (!a.jeuneName && b.jeuneName) {
                    return 1;
                  } else if (a.jeuneName && !b.jeuneName) {
                    return -1;
                  } else {
                    if (a.jeuneOrigin === "alien" && b.jeuneOrigin !== "alien")
                      return -1;
                    if (a.jeuneOrigin !== "alien" && b.jeuneOrigin === "alien")
                      return 1;
                    return a.jeuneOutAppFirstname.localeCompare(
                      b.jeuneOutAppFirstname
                    );
                  }
                })
                .map((jeune, index) => (
                  <div
                    className={`PopupDetailsPresencePersonCard ${
                      jeune === "Aucun" ? "aucunInscrit" : ""
                    }`}
                    key={index}
                  >
                    <span>
                      {decryptData(jeune.jeuneName) ||
                        (jeune.jeuneOutAppFirstname && (
                          <span
                            style={{
                              color:
                                jeune.jeuneOrigin === "alien"
                                  ? "#ffd079"
                                  : "#9C79FF",
                            }}
                          >
                            {jeune.jeuneOutAppFirstname}{" "}
                            {jeune.jeuneOutAppLastname}
                          </span>
                        ))}
                    </span>
                    <div
                      className={`PopupDetailsPresenceCoche ${
                        jeune.isPresent || jeune.jeuneOutAppFirstname
                          ? "active"
                          : "notActive"
                      }`}
                      style={{
                        pointerEvents: jeune.jeuneOutAppFirstname
                          ? "none"
                          : "auto",
                      }}
                      onClick={() => toggleSelectedJeune(jeune.jeuneUid)}
                    >
                      <BsCheckLg
                        style={{
                          color: selectedPeople[jeune.jeuneUid]
                            ? "white"
                            : "#eef6ff",
                          fontSize: "1.2rem",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
            {
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  padding: formAddUserWhoIsNotInTheApp ? "40px 0px" : "0px",
                  position: "absolute",
                  flexDirection: "column",
                  bottom: "10vh",
                  right: formAddUserWhoIsNotInTheApp ? "20px" : "20px",
                  width: formAddUserWhoIsNotInTheApp ? "90%" : "7vh",
                  height: formAddUserWhoIsNotInTheApp ? "50vh" : "7vh",
                  backgroundColor: "white",
                  borderRadius: formAddUserWhoIsNotInTheApp ? "15px" : "20px",
                  boxShadow: "0 0px 30px -2px rgba(203, 228, 255, 0.9)",
                  overflow: "hidden",
                  transition:
                    "width 1s ease-in-out, height 1s ease-in-out, right 1s ease-in-out",
                  zIndex: 2,
                }}
              >
                {!formAddUserWhoIsNotInTheApp && (
                  <FaUserPlus
                    style={{
                      fontSize: "2rem",
                      color: "rgba(203, 228, 255, 0.9)",
                    }}
                    onClick={toggleFormAddUserWhoIsNotInTheApp}
                  />
                )}
                {formAddUserWhoIsNotInTheApp && showContent && (
                  <>
                    <BackArrow
                      backArrowFunction={toggleFormAddUserWhoIsNotInTheApp}
                      arrowPosition={"absolute"}
                      xPosition={"20px"}
                      yPosition={"20px"}
                      icon={"cross"}
                    />
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "700",
                      }}
                    >
                      Ajouter un jeune <br />
                      hors application
                    </p>
                    <select
                      style={{
                        width: "70%",
                        height: "40px",
                        fontWeight: "700",
                        borderRadius: "40px",
                        backgroundColor: "#FFF",
                        boxShadow: "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
                        border: "none",
                        paddingLeft: "20px",
                        color: "#B5D6FF",
                        marginTop: "20px",
                      }}
                      value={jeuneOutAppOrigin}
                      onChange={(event) =>
                        setJeuneOutAppOrigin(event.target.value)
                      }
                    >
                      <option value="alien">Est hors de l'application</option>
                      <option value="nonInscrit">Ne s'est pas inscrit</option>
                    </select>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "10px",
                      }}
                    >
                      Prénom
                      <input
                        value={jeuneOutAppFirstname}
                        onChange={(e) =>
                          setJeuneOutAppFirstname(e.target.value)
                        }
                        style={{
                          width: "100%",
                          height: "40px",
                          fontWeight: "700",
                          borderRadius: "40px",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
                          border: "none",
                          paddingLeft: "20px",
                          color: "#B5D6FF",
                        }}
                      />
                    </label>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "20px",
                      }}
                    >
                      Nom
                      <input
                        value={jeuneOutAppLastname}
                        onChange={(e) => setJeuneOutAppLastname(e.target.value)}
                        style={{
                          width: "100%",
                          height: "40px",
                          fontWeight: "700",
                          borderRadius: "40px",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
                          border: "none",
                          paddingLeft: "20px",
                          color: "#B5D6FF",
                        }}
                      />
                    </label>

                    <button
                      onClick={addJeuneWhoIsNotOnTheApp}
                      style={{
                        fontWeight: "700",
                        borderRadius: "40px",
                        backgroundColor: "#FFF",
                        boxShadow: "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
                        border: "none",
                        padding: "10px 20px",
                        color: "#B5D6FF",
                        fontSize: "1.2rem",
                        marginTop: "20px",
                      }}
                    >
                      ok
                    </button>
                  </>
                )}
              </div>
            }
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              {eventJeunesInscrits.some(
                (jeune) => jeune.jeuneOrigin === "alien"
              ) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "10px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: "#ffd079",
                    }}
                  />
                  <p style={{ marginLeft: "10px" }}>
                    Est hors de l'application
                  </p>
                </div>
              )}

              {eventJeunesInscrits.some(
                (jeune) => jeune.jeuneOrigin === "nonInscrit"
              ) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: "#9C79FF",
                    }}
                  />
                  <p style={{ marginLeft: "10px" }}>Ne s'est pas inscrit</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {btnsCtaEditAndRemove && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.30)",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "10",
            opacity: "80%",
            zIndex: 1000,
          }}
        />
      )}

      {messageDelete && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "80%",
            transform: "translate(-50%,-50%)",
            backgroundColor: "white",
            zIndex: "10",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 1001,
          }}
        >
          <p>Confirmez la suppression de {eventTitle}?</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              fontSize: "1.4rem",
            }}
          >
            <p onClick={handleRemoveEvent}>oui</p>
            <p onClick={() => setMessageDelete(false)}>non</p>
          </div>
        </div>
      )}

      {btnsCtaAboutAndParticipants === "about" && (
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#C6253D",
            marginLeft: "auto",
            position: "absolute",
            right: "30px",
            bottom: "80px",
            zIndex: "11",
            borderRadius: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: btnsCtaEditAndRemove ? "-60px" : "15px",
              right: "10px",
              transition: "top 0.7s ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                opacity: btnsCtaEditAndRemove ? "100%" : "0%",
                marginRight: "10px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Supprimer
            </p>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C6253D",
                boxShadow: "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
              }}
              onClick={() => setMessageDelete(true)}
            >
              <FaTrash />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: btnsCtaEditAndRemove ? "-120px" : "15px",
              right: "10px",
              transition: "top 0.7s ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                opacity: btnsCtaEditAndRemove ? "100%" : "0%",
                marginRight: "10px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Modifier
            </p>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C6253D",
                boxShadow: "0px 0px 10px 0px rgba(203, 228, 255, 0.60)",
              }}
              onClick={handleOpenModifyPopup}
            >
              <FaPen />
            </div>
          </div>

          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#C6253D",
              borderRadius: "50px",
              position: "absolute",
              zIndex: "2",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              zIndex: "2",
            }}
          >
            {btnsCtaEditAndRemove ? (
              <ImCross
                size={20}
                color="white"
                onClick={() => toggleBtnsCtaEditAndRemove()}
              />
            ) : (
              <GiHamburgerMenu
                size={25}
                color="white"
                onClick={() => toggleBtnsCtaEditAndRemove()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupDetailsProgramm;
