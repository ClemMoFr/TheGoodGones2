import React, { useState } from "react";
import { ref, remove } from "firebase/database";
import FirebaseConfig from "../../../firebase/FirebaseConfig";

import "./PopupDetailsMonos.css";

import { BsFillTelephoneFill, BsFillTrash3Fill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import PopupModifyMonos from "../popup-modify-monos/PopupModifyMonos";
import BackArrow from "../../back-arrow/BackArrow";

const PopupDetailsMonos = ({
  monoFirstName,
  monoLastName,
  monoGroup,
  monoInfos,
  monoPhone,
  monoMail,
  monoId,
  monosStatus,
  groupSelectorData,
  updateMono,
  backArrowFunction,
}) => {
  const [popupModify, setPopupModify] = useState(false);
  const [messageDelete, setMessageDelete] = useState(false);

  const { database } = FirebaseConfig();

  const deleteMono = async (monoId) => {
    try {
      await remove(ref(database, `monos/${groupSelectorData}/${monoId}`));
      backArrowFunction();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.message);
    }
  };

  return (
    <div className="popupDetailsMonosMainContainer">
      <div className="popupDetailsMonos">
        <div className="popupDetailsMonosTop">
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"absolute"}
            xPosition={"15px"}
            yPosition={"15px"}
            icon={"cross"}
          />
          <AiOutlineUser size={70} color="#CBE4FF" />
          <div className="MonosNameAndGroup">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p style={{ marginRight: "5px" }}>{monoFirstName}</p>
              <p>{monoLastName}</p>
            </div>
            {monoGroup && <div className="monosGroup">{monoGroup} </div>}
          </div>
        </div>
        <div className="popupDetailsMonosInfos">
          <p>information importantes</p>
          <p>{monoInfos}</p>
        </div>
        <div className="popupDetailsMonosPhone">
          <BsFillTelephoneFill size={20} color="#c6253d" />
          <p>{monoPhone}</p>
        </div>
        <div className="popupDetailsMonosMail">
          <IoMdMail size={20} color="#c6253d" />
          <p>{monoMail}</p>
        </div>

        <p
          className="popupDetailsMonosBtnModify"
          onClick={() => setPopupModify(true)}
        >
          modifier
        </p>
        <div
          className="popupDetailsMonosTrash"
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
                <p onClick={() => deleteMono(monoId)}>oui</p>
                <p onClick={() => setMessageDelete(false)}>non</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {popupModify && (
        <PopupModifyMonos
          monoId={monoId}
          monosStatus={monosStatus}
          groupSelectorData={groupSelectorData}
          updateMono={updateMono}
          backArrowFunction={() => setPopupModify(false)}
        />
      )}
    </div>
  );
};

export default PopupDetailsMonos;
