import React, { useState } from "react";

import "./PopupDetailsContact.css";

import { BsHouseFill, BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import PopupModifyContact from "../popup-modify-contact/PopupModifyContact";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupDetailsContact = ({
  decryptField,
  familyId,
  familyName,
  familyAdress,
  familyFixPhone,
  familyDadName,
  familyMobileDad,
  familyMailDad,
  familyMumName,
  familyMobileMum,
  familyMailMum,
  familleChildrens,
  jeunesData,
  backArrowFunction,
  handleRefreshFunction,
  onDelete,
}) => {
  const [popupModifyContact, setPopupModifyContact] = useState(null);

  const handleDelete = () => {
    onDelete(familyId);
    backArrowFunction();
    handleRefreshFunction();
  };

  const [messageDelete, setMessageDelete] = useState(false);

  return (
    <div className="popupDetailsContactMainContainer">
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <BackArrow
          backArrowFunction={backArrowFunction}
          arrowPosition={"relative"}
          xPosition={"20px"}
          yPosition={"0px"}
          icon={"arrow"}
        />
      </div>
      {messageDelete && (
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
              Confirmez la suppression du contact de la famille{" "}
              {decryptField(familyName)} ?
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
              <p onClick={handleDelete}>oui</p>
              <p onClick={() => setMessageDelete(false)}>non</p>
            </div>
          </div>
        </div>
      )}
      {popupModifyContact ? (
        <PopupModifyContact
          familyId={familyId}
          jeunesData={jeunesData}
          handleRefreshFunction={handleRefreshFunction}
          decryptField={decryptField}
          handleModifyApplied={() => backArrowFunction()}
          backArrowFunction={() => setPopupModifyContact(false)}
        />
      ) : (
        <div
          style={{
            width: "100%",
            margin: "0px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "90%",
          }}
        >
          <div className="popupDetailsContactCard">
            <p>
              Famille <span>{decryptField(familyName)}</span>
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "90%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <BsHouseFill
                  size={30}
                  color="#c6253d"
                  style={{ marginRight: "20px" }}
                />
                {decryptField(familyAdress)}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <BsFillTelephoneFill
                  size={30}
                  color="#c6253d"
                  style={{ marginRight: "20px" }}
                />
                {decryptField(familyFixPhone)}
              </div>
            </div>
            <div className="popupDetailsContactParents">
              <p className="popupDetailsContactParentsName">
                {decryptField(familyDadName)} {decryptField(familyName)}
              </p>
              <div className="popupDetailsContactParentsInfos">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <BsFillTelephoneFill
                    size={30}
                    color="#c6253d"
                    style={{ marginRight: "20px" }}
                  />
                  {decryptField(familyMobileDad)}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <IoMdMail
                    size={30}
                    color="#c6253d"
                    style={{ marginRight: "20px" }}
                  />
                  {decryptField(familyMailDad)}
                </div>
              </div>
            </div>
            <div className="popupDetailsContactParents">
              <p className="popupDetailsContactParentsName">
                {decryptField(familyMumName)} {decryptField(familyName)}
              </p>
              <div className="popupDetailsContactParentsInfos">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <BsFillTelephoneFill
                    size={30}
                    color="#c6253d"
                    style={{ marginRight: "20px" }}
                  />
                  {decryptField(familyMobileMum)}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <IoMdMail
                    size={30}
                    color="#c6253d"
                    style={{ marginRight: "20px" }}
                  />
                  {decryptField(familyMailMum)}
                </div>
              </div>
            </div>
            <p
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "90%",
                fontSize: "20px",
                fontWeight: "600",
                color: "#CFE0FD",
              }}
            >
              enfant
            </p>
            <div className="popupDetailsContactChildrensContainer">
              {familleChildrens && familleChildrens.length > 0 ? (
                familleChildrens.map((childName, index) => (
                  <span className="contactChildCard" key={index}>
                    {childName}
                  </span>
                ))
              ) : (
                <span className="contactChildCard">
                  Pas d'enfant enregistré
                </span>
              )}
            </div>
          </div>
          <div className="popupDetailsContactButtonContainer">
            <button onClick={() => setPopupModifyContact(familyId)}>
              Modifier
            </button>
            <button onClick={() => setMessageDelete(true)}>Supprimer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupDetailsContact;
