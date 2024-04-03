import React, { useEffect, useState } from "react";
import "./PopupDetailsPresence.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  ref,
  set,
  get,
  push,
  update,
  onValue,
  remove,
} from "firebase/database";
import BackArrow from "../../../back-arrow/BackArrow";
import FirebaseConfig from "../../../../firebase/FirebaseConfig";

const PopupDetailsPresence = ({
  eventId,
  eventTitle,
  eventJeunesDate,
  eventJeunesHoraires,
  eventJeunesLieu,
  eventJeunesCoordonnees,
  userData,
  backArrowFunction,
}) => {
  const [jeunes, setJeunes] = useState([]);
  const [groupSelector, setGroupSelector] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [eventJeunesInscrits, setEventJeunesInscrits] = useState([]);
  const [formAddUserWhoIsNotInTheApp, setFormAddUserWhoIsNotInTheApp] =
    useState(false);

  useEffect(() => {
    const savedJeunes = JSON.parse(localStorage.getItem("jeunes")) || [];
    setJeunes(savedJeunes);
    setFilteredByName(savedJeunes);
    setSelectedPeople(savedJeunes.map(() => false));
  }, []);

  const { database } = FirebaseConfig();

  const sendEventInscription = async () => {
    const jeuneName = userData.additionalInfo.jeuneFirstName;
    const jeuneUid = userData.additionalInfo.uid;

    const eventRef = ref(
      database,
      `evenements/${eventId}/jeunesInscrits/${jeuneUid}`
    );

    const jeuneData = {
      jeuneName: jeuneName,
      jeuneUid: jeuneUid,
      isPresent: false,
    };

    set(eventRef, jeuneData);
  };

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

  return (
    <div className="PopupDetailsPresenceMainContainer">
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
        <p>{eventJeunesDate.dateDay}</p>
        <p>
          {eventJeunesDate.dateMonth && eventJeunesDate.dateMonth.length >= 4
            ? eventJeunesDate.dateMonth.substring(0, 3)
            : eventJeunesDate.dateMonth}
        </p>
      </div>

      <p
        style={{
          marginTop: "95px",
          fontSize: "1.5rem",
          fontWeight: "700",
          width: "78%",
        }}
      >
        {eventTitle}
      </p>
      <p>
        De {eventJeunesHoraires.start}h à {eventJeunesHoraires.end}h
      </p>
      <button
        style={{
          padding: "10px",
          textRransform: "uppercase",
          border: "none",
          borderRadius: "10px",
          backgroundColor: " #c6253d",
          color: "white",
          fontSize: "0.9rem",
          marginTop: "20px",
        }}
      >
        A propos
      </button>

      <p
        style={{
          margin: "10px 0px",
        }}
      >
        Localisation : {eventJeunesLieu}
      </p>

      <MapContainer
        center={eventJeunesCoordonnees}
        zoom={20}
        style={{ height: "170px", width: "100%", borderRadius: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && (
          <Marker position={eventJeunesCoordonnees} icon={customIcon}>
            <Popup>{eventJeunesLieu}</Popup>
          </Marker>
        )}
      </MapContainer>
      <>
        {!Object.values(eventJeunesInscrits).some(
          (jeune) => jeune.jeuneUid === userData.additionalInfo.uid
        ) ? (
          <button
            style={{
              padding: "10px 20px",
              border: "none",
              backgroundColor: "#c6253d",
              color: "#ffffff",
              borderRadius: "20px",
              fontSize: "1.2rem",
              fontWeight: "700",
              margin: "50px auto 0px",
            }}
            onClick={() => sendEventInscription()}
          >
            Je m'inscris !
          </button>
        ) : (
          <span
            style={{
              padding: "10px 20px",
              border: "none",
              color: "#c6253d",
              borderRadius: "20px",
              fontSize: "1rem",
              fontWeight: "700",
              textAlign: "center",
              margin: "50px auto 0px",
            }}
          >
            Tu t'es inscrit <br />à cet événement !
          </span>
        )}
      </>
    </div>
  );
};

export default PopupDetailsPresence;
