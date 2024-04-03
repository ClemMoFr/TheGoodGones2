import React, { useEffect, useState } from "react";

import { ref, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

import "./Programme.css";
import PopupAddProgramm from "../../../components/Gestion/Programme/popup-add-programme/PopupAddProgramm";
import PopupModifyProgramm from "../../../components/Gestion/Programme/popup-modify-programme/PopupModifyProgramm";
import PopupDetailsProgramm from "../../../components/Gestion/Programme/popup-details-programme/PopupDetailsProgramm";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

const Programme = () => {
  const [popupAddProgramme, setPopupAddProgramme] = useState(false);
  const [popupModifyProgramme, setPopupModifyProgramme] = useState(false);
  const [popupDetailsProgramme, setPopupDetailsProgramme] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([]);

  const { database } = FirebaseConfig();

  useEffect(() => {
    const dataRef = ref(database, `evenements/`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setEvents(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setEvents([]);
      }
    });
    return () => unsubscribe();
  }, [database]);

  function openModifyPopup() {
    setPopupDetailsProgramme(false);
    setPopupModifyProgramme(true);
  }

  const removeEvent = async (eventId) => {
    try {
      const eventRef = ref(database, `evenements/${eventId}`);

      await remove(eventRef);

      setPopupDetailsProgramme(false);
    } catch (error) {
      console.error("Error removing event from Firestore:", error.message);
    }
  };

  return (
    <div className="programmeMainContainer">
      <div className="programmeTop">
        <div className="programmeTopIcon"></div>
        <p className="programmeTopTitle">Gestion</p>
        <p className="programmeTopSubtitle">Programme</p>
      </div>
      {popupAddProgramme && (
        <PopupAddProgramm
          backArrowFunction={() => setPopupAddProgramme(false)}
        />
      )}
      {popupModifyProgramme && (
        <PopupModifyProgramm
          eventId={selectedEvent.id}
          coordonnees={selectedEvent.coordonnees}
          backArrowFunction={() => setPopupModifyProgramme(false)}
        />
      )}
      {popupDetailsProgramme && (
        <PopupDetailsProgramm
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.nom}
          eventDay={selectedEvent.date.dateDay}
          eventMonth={selectedEvent.date.dateMonth}
          eventAccueil={selectedEvent.equipeAccueil}
          eventEtude={selectedEvent.etude}
          eventGG={selectedEvent.jeunesGG}
          eventMiniGG={selectedEvent.jeunesMiniGG}
          eventStaffGG={selectedEvent.equipeStaffGG}
          eventStaffMiniGG={selectedEvent.equipeStaffMiniGG}
          eventJeuxGG={selectedEvent.equipeJeuxGG}
          eventJeuxMiniGG={selectedEvent.equipeJeuxMiniGG}
          eventHoraire={selectedEvent.horaire}
          eventGouter={selectedEvent.equipeGouter}
          eventLouange={selectedEvent.equipeLouange}
          eventLieu={selectedEvent.lieu}
          eventManager={selectedEvent.manager}
          eventAbsent={selectedEvent.absents}
          eventVehicules={selectedEvent.vehicules}
          eventActivity={selectedEvent.activites}
          programmStatus={selectedEvent.programmStatus}
          coordonnees={selectedEvent.coordonnees}
          eventJeunesInscrit={selectedEvent.jeunesInscrits}
          handleOpenModifyPopup={() => openModifyPopup()}
          handleRemoveEvent={() => removeEvent(selectedEvent.id)}
          backArrowFunction={() => setPopupDetailsProgramme(false)}
        />
      )}

      {!popupAddProgramme &&
        !popupModifyProgramme &&
        !popupDetailsProgramme && (
          <div className="programmeBottom">
            <button
              className="btnAddProgramme"
              onClick={() => setPopupAddProgramme(true)}
            >
              Ajouter un nouvel événement
            </button>
            <p className="subtitle">Les prochains événements</p>
            <div className="programmeEventContainer">
              {events.map((event) => (
                <div className="programmeEvent" key={event.id}>
                  <div className="topSection">
                    <div className="date">
                      <p style={{ marginBottom: "10px" }}>
                        {event.date.dateDay}
                      </p>

                      <p>
                        {event.date.dateMonth &&
                        event.date.dateMonth.length >= 5
                          ? event.date.dateMonth.substring(0, 3)
                          : event.date.dateMonth}
                      </p>
                    </div>
                    <div className="mainInfo">
                      <p>{event.nom}</p>
                      <p>
                        de {event.horaire.start} h à {event.horaire.end} h
                      </p>
                      <p>{event.lieu}</p>
                    </div>
                  </div>
                  <p style={{ marginTop: "20px" }}>Manager : {event.manager}</p>
                  <button
                    onClick={() => {
                      setPopupDetailsProgramme(true);
                      setSelectedEvent(event);
                    }}
                  >
                    Détails
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default Programme;
