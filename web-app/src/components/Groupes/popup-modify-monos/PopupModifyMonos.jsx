import React, { useEffect, useState } from "react";

import "./PopupModifyMonos.css";

import { AiOutlineUser } from "react-icons/ai";

import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { BiSolidLock } from "react-icons/bi";
import BackArrow from "../../back-arrow/BackArrow";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { get, ref, update } from "firebase/database";

import CryptoJS from "crypto-js";

const PopupModifyMonos = ({
  monoId,
  monosStatus,
  backArrowFunction,
  groupSelectorData,
}) => {
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newInformation, setNewInformation] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [newMail, setNewMail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newMobile, setNewMobile] = useState("");

  const { database } = FirebaseConfig();

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  useEffect(() => {
    const monoRef = ref(database, `monos/${groupSelectorData}/${monoId}`);

    get(monoRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const monoData = snapshot.val();

          // decrypt
          const decryptedMonoFirstName = CryptoJS.AES.decrypt(
            monoData?.additionalInfo?.monoFirstName || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);
          const decryptedMonoLastName = CryptoJS.AES.decrypt(
            monoData?.additionalInfo?.monoLastName || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);
          const decryptedMonoMail = CryptoJS.AES.decrypt(
            monoData?.additionalInfo?.email || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);
          const decryptedMonoMobile = CryptoJS.AES.decrypt(
            monoData?.additionalInfo?.monoMobile || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);

          // attributes
          setNewFirstName(decryptedMonoFirstName || "");
          setNewLastName(decryptedMonoLastName || "");
          setNewInformation(monoData.additionalInfo.monoInformation || "");
          setNewGroup(monoData.additionalInfo.monoGroup || "");
          setNewMail(decryptedMonoMail || "");
          setNewPassword(monoData.additionalInfo.monoPassword || "");
          setNewMobile(decryptedMonoMobile || "");
        } else {
          console.log("Aucune donnée trouvée pour ce mono.");
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message
        );
      });
  }, [monoId]);

  const handleUpdate = () => {
    const encryptedMonoFirstName = CryptoJS.AES.encrypt(
      newFirstName,
      commonPass
    ).toString();
    const encryptedMonoLastName = CryptoJS.AES.encrypt(
      newLastName,
      commonPass
    ).toString();
    const encryptedMonoMail = CryptoJS.AES.encrypt(
      newMail,
      commonPass
    ).toString();
    const encryptedMonoMobile = CryptoJS.AES.encrypt(
      newMobile,
      commonPass
    ).toString();
    const monoRef = ref(database, `monos/${groupSelectorData}/${monoId}`);
    update(monoRef, {
      additionalInfo: {
        uid: monoId,
        monoFirstName: encryptedMonoFirstName,
        monoLastName: encryptedMonoLastName,
        monoInformation: newInformation,
        monoGroup: newGroup,
        email: encryptedMonoMail,
        monoPassword: newPassword,
        monoMobile: encryptedMonoMobile,
        groupSelectorData: groupSelectorData,
        status: monosStatus,
      },
    })
      .then(() => {
        console.log("Mono mis à jour avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du mono :", error.message);
      });
  };

  return (
    <form className="popupModifyMonosMainContainer">
      <div className="popupModifyMonos">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            marginBottom: "30px",
          }}
        >
          <p className="popupModifyTitleJeune">
            Modifier <br />
            un mono
          </p>
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"absolute"}
            xPosition={"0px"}
            yPosition={"0px"}
            icon={"arrow"}
          />
        </div>
        <AiOutlineUser
          size={70}
          color="#CBE4FF"
          style={{ margin: "auto", width: "100%" }}
        />
        <div className="popupModifyMonosTop">
          <label style={{ width: "50%", marginRight: "20px" }}>
            Prénom
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
          </label>
          <label style={{ width: "50%" }}>
            Nom
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Informations importantes
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={newInformation}
              onChange={(e) => setNewInformation(e.target.value)}
            />
          </label>
        </div>
        <label className="inputRow">
          <span>
            <BsFillTelephoneFill size={25} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={newMobile}
            onChange={(e) => setNewMobile(e.target.value)}
          />
        </label>
        <label className="inputRow">
          <span>
            <IoMdMail size={25} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={newMail}
            onChange={(e) => setNewMail(e.target.value)}
          />
        </label>
        <label className="inputRow">
          <span>
            <BiSolidLock size={30} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button onClick={handleUpdate}>Modifier</button>
      </div>
    </form>
  );
};

export default PopupModifyMonos;
