import React, { useState } from "react";

import "./PopupDetailsActivity.css";

import { FaChildren } from "react-icons/fa6";
import { BiSolidTimer } from "react-icons/bi";
import { FaPencilRuler } from "react-icons/fa";
import PopupModifyActivity from "../popup-modify-activite/PopupModifyActivity";
import BackArrow from "../../back-arrow/BackArrow";

const PopupDetailsActivite = ({
  activitesId,
  activitesTitle,
  activitesDescription,
  activitesDuree,
  activitesType,
  activitesMin,
  activitesMax,
  activitesMateriel,
  activitesModifyTitle,
  activitesModifyDescription,
  activitesModifyDuree,
  activitesModifyType,
  activiteModifysMin,
  activitesModifyMax,
  activitesModifyMateriel,
  updateActivity,
  deleteActivityFunction,
  backArrowFunction,
}) => {
  const [popupModifyActivity, setPopupModifyActivity] = useState(false);
  const [messageDelete, setMessageDelete] = useState(false);
  return (
    <>
      {messageDelete ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafcff",
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0px",
            left: "0px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "0px 0px 30px 0px rgba(203, 228, 255, 0.60)",
              padding: "30px",
              width: "80%",
              fontSize: "1rem",
              borderRadius: "20px",
            }}
          >
            <p
              style={{
                marginBottom: "20px",
              }}
            >
              Confirmez la suppression de {activitesTitle} ?
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "50%",
                justifyContent: "space-between",
                fontSize: "1.4rem",
              }}
            >
              <p onClick={deleteActivityFunction}>oui</p>
              <p onClick={() => setMessageDelete(false)}>non</p>
            </div>
          </div>
        </div>
      ) : popupModifyActivity ? (
        <PopupModifyActivity
          activitesId={activitesId}
          activitesModifyTitle={activitesModifyTitle}
          activitesModifyDescription={activitesModifyDescription}
          activitesModifyDuree={activitesModifyDuree}
          activitesModifyType={activitesModifyType}
          activiteModifysMin={activiteModifysMin}
          activitesModifyMax={activitesModifyMax}
          activitesModifyMateriel={activitesModifyMateriel}
          updateActivity={updateActivity}
          backArrowFunction={() => setPopupModifyActivity(false)}
        />
      ) : (
        <div className="popupDetailsActiviteMainContainer">
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"absolute"}
            xPosition={"20px"}
            yPosition={"20px"}
            icon={"arrow"}
          />
          <p className="popupDetailsActiviteActivityName">{activitesTitle}</p>
          <div>
            <p className="popupDetailsActiviteSubtitle">
              Jeu d'{activitesType}
            </p>
            <p className="popupDetailsActiviteLine">
              <FaChildren
                style={{
                  fontSize: "30px",
                  color: "#1C2A4B",
                  marginRight: "10px",
                }}
              />
              {activitesMin} à {activitesMax} personnes
            </p>
            <p className="popupDetailsActiviteLine">
              <BiSolidTimer
                style={{
                  fontSize: "30px",
                  color: "#1C2A4B",
                  marginRight: "10px",
                }}
              />
              {activitesDuree} minutes
            </p>
            <p className="popupDetailsActiviteLine">
              <FaPencilRuler
                style={{
                  fontSize: "30px",
                  color: "#1C2A4B",
                  marginRight: "10px",
                }}
              />
              {activitesMateriel}
            </p>
          </div>
          <div>
            <p className="popupDetailsActiviteSubtitle">Description</p>
            <textarea className="popupDetailsActiviteDescription">
              {activitesDescription}
            </textarea>
          </div>
          <div className="popupDetailsActiviteButtonContainer">
            <button onClick={() => setPopupModifyActivity(true)}>
              Modifier
            </button>
            <button onClick={() => setMessageDelete(true)}>Supprimer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupDetailsActivite;
