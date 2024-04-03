import React, { useState } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

import { AiOutlineUser } from "react-icons/ai";

import "./PopupDetailsJeune.css";

import { BsFillTelephoneFill, BsFillTrash3Fill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import PopupModifyJeune from "../popup-modify-jeune/PopupModifyJeune";
import BackArrow from "../../back-arrow/BackArrow";

const PopupDetailsJeune = ({
  jeuneFirstName,
  jeuneLastName,
  jeuneGroup,
  jeuneInfos,
  jeunePhone,
  jeuneMail,
  jeuneId,
  jeuneModifyFirstName,
  jeuneStatus,
  groupSelectorData,
  updateJeune,
  deleteJeuneFunction,
  backArrowFunction,
}) => {
  const [popupModify, setPopupModify] = useState(false);
  const [messageDelete, setMessageDelete] = useState(false);

  const { database } = FirebaseConfig();

  const deleteJeune = async (jeuneId) => {
    try {
      await remove(ref(database, `jeunes/${groupSelectorData}/${jeuneId}`));
      backArrowFunction();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.message);
    }
  };

  return (
    <div className="popupDetailsJeuneMainContainer">
      <div className="popupDetailsJeune">
        <div className="popupDetailsJeuneTop">
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"absolute"}
            xPosition={"15px"}
            yPosition={"15px"}
            icon={"cross"}
          />
          <AiOutlineUser size={70} color="#CBE4FF" />
          <div className="jeuneNameAndGroup">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p style={{ marginRight: "5px" }}>{jeuneFirstName}</p>
              <p>{jeuneLastName}</p>
            </div>

            {jeuneGroup && <div className="jeuneGroup">{jeuneGroup} </div>}
          </div>
        </div>
        <div className="popupDetailsJeuneInfos">
          <p>information importantes</p>
          <p>{jeuneInfos}</p>
        </div>
        <div className="popupDetailsJeunePhone">
          <BsFillTelephoneFill size={20} color="#c6253d" />
          <p>{jeunePhone}</p>
        </div>
        <div className="popupDetailsJeuneMail">
          <IoMdMail size={20} color="#c6253d" />
          <p>{jeuneMail}</p>
        </div>
        <p
          className="popupDetailsJeuneBtnModify"
          onClick={() => setPopupModify(true)}
        >
          modifier
        </p>
        <div
          className="popupDetailsJeuneTrash"
          style={{ width: messageDelete === true ? "100%" : "" }}
        >
          {messageDelete === false ? (
            <div onClick={() => setMessageDelete(true)}>
              <BsFillTrash3Fill size={25} />
            </div>
          ) : (
            ""
          )}
          {messageDelete && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>Confirmez la suppression ?</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "space-between",
                  fontSize: "1.4rem",
                }}
              >
                <p onClick={() => deleteJeune(jeuneId)}>oui</p>
                <p onClick={() => setMessageDelete(false)}>non</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {popupModify && (
        <PopupModifyJeune
          jeuneId={jeuneId}
          groupSelectorData={groupSelectorData}
          updateJeune={updateJeune}
          jeuneStatus={jeuneStatus}
          backArrowFunction={() => setPopupModify(false)}
        />
      )}
    </div>
  );
};

export default PopupDetailsJeune;
