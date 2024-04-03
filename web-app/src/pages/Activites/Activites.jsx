import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../firebase/FirebaseConfig";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

import "./Activites.css";

import { FaChevronRight } from "react-icons/fa";
import PopupDetailsActivite from "../../components/Activites/popup-details-activite/PopupDetailsActivity";
import PopupAddActivite from "../../components/Activites/popup-add-activite/PopupAddActivity";

const Activites = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [popupDetailActivity, setDetailActivity] = useState(false);
  const [popupAddActivity, setAddActivity] = useState(false);

  const handleDetailClick = (activity) => {
    setSelectedActivity(activity);
    setDetailActivity(true);
  };

  const { database } = FirebaseConfig();

  const [activities, setActivities] = useState([]);
  const [activitesTitle, setActivitesTitle] = useState("");
  const [activitesDescription, setActivitesDescription] = useState("");
  const [activitesDuree, setActivitesDuree] = useState("");
  const [activitesType, setActivitesType] = useState("");
  const [activitesMin, setActivitesMin] = useState("");
  const [activitesMax, setActivitesMax] = useState("");
  const [activitesMateriel, setActivitesMateriel] = useState("");

  useEffect(() => {
    const dataRef = ref(database, `activites`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setActivities(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setActivities([]);
      }
    });
    return () => unsubscribe();
  }, [database]);

  const addActivites = (e) => {
    const activiteId = uuidv4();
    set(ref(database, `activites/${activiteId}`), {
      id: activiteId,
      activitesTitle: activitesTitle,
      activitesDescription: activitesDescription,
      activitesDuree: activitesDuree,
      activitesType: activitesType,
      activitesMin: activitesMin,
      activitesMax: activitesMax,
      activitesMateriel: activitesMateriel,
    });

    e.preventDefault();

    setAddActivity(false);
    setActivitesTitle("");
    setActivitesDescription("");
    setActivitesDuree("");
    setActivitesType("");
    setActivitesMin("");
    setActivitesMax("");
    setActivitesMateriel("");
  };

  const updateActivity = (
    id,
    newActivitesTitle,
    newActivitesDescription,
    newActivitesDuree,
    newActivitesType,
    newActivitesMin,
    newActivitesMax,
    newActivitesMateriel
  ) => {
    const activiteRef = ref(database, `activites/${id}`);

    const updates = {
      activitesTitle: newActivitesTitle,
      activitesDescription: newActivitesDescription,
      activitesDuree: newActivitesDuree,
      activitesType: newActivitesType,
      activitesMin: newActivitesMin,
      activitesMax: newActivitesMax,
      activitesMateriel: newActivitesMateriel,
    };
    setDetailActivity(false);
    update(activiteRef, updates)
      .then(() => {
        console.log("Mise à jour réussie!");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour:", error.message);
      });
  };

  const deleteActivity = async (id) => {
    try {
      await remove(ref(database, `activites/${id}`));

      const updatedActivity = activities.filter(
        (activity) => activity.id !== id
      );
      setActivities(updatedActivity);

      setDetailActivity(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.message);
    }
  };

  return (
    <div className="activitesMainContainer">
      <div className="activitesTop">
        <div className="activitesTopIcon"></div>
        <p className="activitesTopTitle">Activités</p>
      </div>

      <div className="activitesBottom">
        {popupDetailActivity && (
          <PopupDetailsActivite
            activity={selectedActivity}
            activitesId={selectedActivity.id}
            activitesTitle={selectedActivity.activitesTitle}
            activitesDescription={selectedActivity.activitesDescription}
            activitesDuree={selectedActivity.activitesDuree}
            activitesType={selectedActivity.activitesType}
            activitesMin={selectedActivity.activitesMin}
            activitesMax={selectedActivity.activitesMax}
            activitesMateriel={selectedActivity.activitesMateriel}
            activitesModifyTitle={selectedActivity.activitesTitle}
            activitesModifyDescription={selectedActivity.activitesDescription}
            activitesModifyDuree={selectedActivity.activitesDuree}
            activitesModifyType={selectedActivity.activitesType}
            activiteModifysMin={selectedActivity.activitesMin}
            activitesModifyMax={selectedActivity.activitesMax}
            activitesModifyMateriel={selectedActivity.activitesMateriel}
            updateActivity={updateActivity}
            deleteActivityFunction={() => deleteActivity(selectedActivity.id)}
            backArrowFunction={() => setDetailActivity(false)}
          />
        )}
        {popupAddActivity && (
          <PopupAddActivite
            valueActivitesTitle={activitesTitle}
            onChangeValueActivitesTitle={(e) =>
              setActivitesTitle(e.target.value)
            }
            valueActivitesDescription={activitesDescription}
            onChangeValueActivitesDescription={(e) =>
              setActivitesDescription(e.target.value)
            }
            valueActivitesDuree={activitesDuree}
            onChangeValueActivitesDuree={(e) =>
              setActivitesDuree(e.target.value)
            }
            valueActivitesType={activitesType}
            onChangeValueActivitesType={(e) => setActivitesType(e.target.value)}
            valueActivitesMin={activitesMin}
            onChangeValueActivitesMin={(e) => setActivitesMin(e.target.value)}
            valueActivitesMax={activitesMax}
            onChangeValueActivitesMax={(e) => setActivitesMax(e.target.value)}
            valueActivitesMateriel={activitesMateriel}
            onChangeValueActivitesMateriel={(e) =>
              setActivitesMateriel(e.target.value)
            }
            handleAddFunction={addActivites}
            backArrowFunction={() => setAddActivity(false)}
          />
        )}
        <button className="btnAddActivity" onClick={() => setAddActivity(true)}>
          Ajouter une activité
        </button>
        <p style={{ marginLeft: "30px", fontSize: "1.2rem", fontWeight: 700 }}>
          Toutes les activités
        </p>
        <div className="activitesCardContainer">
          {activities.map((activity, index) => (
            <div
              className="activitesCard"
              onClick={() => {
                handleDetailClick(activity);
                setDetailActivity(true);
              }}
            >
              <p className="activitesName">{activity.activitesTitle}</p>
              <FaChevronRight
                style={{ position: "absolute", bottom: 20, right: 20 }}
                color="#C6253D"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activites;
