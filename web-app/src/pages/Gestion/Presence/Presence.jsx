import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { useAuth } from "../../../firebase/AuthContext";
import { ref, set, get, update, onValue, remove } from "firebase/database";

import "./Presence.css";

import PopupDetailsPresence from "../../../components/Gestion/Presence/popup-details-presence/PopupDetailsPresence";

const Presence = () => {
  const [popupAddPresence, setPopupAddPresence] = useState(false);
  const [popupModifyPresence, setPopupModifyPresence] = useState(false);
  const [popupDetailsPresence, setPopupDetailsPresence] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([]);

  const { database } = FirebaseConfig();

  const { userData } = useAuth();

  useEffect(() => {
    const dataRef = ref(database, `evenements`);
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

  return (
    <div className="presenceMainContainer">
      <div className="presenceTop">
        <div className="presenceTopIcon"></div>
        <p className="presenceTopTitle">Mes événements</p>
      </div>

      {popupDetailsPresence && (
        <PopupDetailsPresence
          userData={userData}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.nom}
          eventJeunesManager={selectedEvent.manager}
          eventJeunesInscrits={selectedEvent.jeunesInscrits || "aucun"}
          eventJeunesDate={selectedEvent.date}
          eventJeunesLieu={selectedEvent.lieu}
          eventJeunesHoraires={selectedEvent.horaire}
          eventJeunesCoordonnees={selectedEvent.coordonnees}
          backArrowFunction={() => setPopupDetailsPresence(false)}
        />
      )}
      {!popupDetailsPresence && (
        <div className="programmeBottom">
          <p className="subtitle">Les prochains événements</p>
          <div className="programmeEventContainer">
            {events
              .filter((event) => {
                if (
                  userData.additionalInfo.status === "jeune" &&
                  event.programmStatus === true
                ) {
                  return true;
                }

                if (
                  userData.additionalInfo.status === "monos" ||
                  userData.additionalInfo.status === "admin"
                ) {
                  return true;
                }

                return false;
              })
              .map((event) => (
                <div className="programmeEvent" key={event.id}>
                  <div className="topSection">
                    <div className="date">
                      <p style={{ marginBottom: "10px" }}>
                        {event.date.dateDay}
                      </p>
                      <p>
                        {" "}
                        {event.date.dateMonth &&
                        event.date.dateMonth.length >= 4
                          ? event.date.dateMonth.substring(0, 3)
                          : event.date.dateMonth}
                      </p>
                    </div>
                    <div className="mainInfo">
                      <p>{event.nom}</p>
                      <p>
                        de {event.horaire.start} h à {event.horaire.end} h
                      </p>
                      <p>Lieu : {event.lieu}</p>
                    </div>
                  </div>
                  {(userData.additionalInfo.status === "monos" ||
                    userData.additionalInfo.status === "admin") && (
                    <>
                      <p style={{ marginTop: "20px" }}>
                        Manager : {event.manager}
                      </p>
                      <p>
                        Absent :{" "}
                        {event.absents.map((absent, index) => (
                          <span key={index}>
                            {absent.additionalInfo &&
                              absent.additionalInfo.monoFirstName && (
                                <>{absent.additionalInfo.monoFirstName}, </>
                              )}
                          </span>
                        ))}
                      </p>
                      <p>
                        Inscription : {event.jeunesGG.length} GG et{" "}
                        {event.jeunesMiniGG.length} mini-gg
                      </p>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setPopupDetailsPresence(true);
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

export default Presence;
