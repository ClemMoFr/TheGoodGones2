import React, { useEffect, useState } from "react";
import "./PopupModifyJeune.css";
import { AiOutlineUser } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { BiSolidLock } from "react-icons/bi";
import BackArrow from "../../back-arrow/BackArrow";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { get, ref, update } from "firebase/database";
import CryptoJS from "crypto-js";

const PopupModifyJeune = ({
  jeuneId,
  jeuneStatus,
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
    const jeuneRef = ref(database, `jeunes/${groupSelectorData}/${jeuneId}`);

    get(jeuneRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const jeuneData = snapshot.val();

          const decryptedJeuneFirstName = CryptoJS.AES.decrypt(
            jeuneData?.additionalInfo?.jeuneFirstName || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);
          const decryptedJeuneLastName = CryptoJS.AES.decrypt(
            jeuneData?.additionalInfo?.jeuneLastName || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);
          const decryptedJeuneMail = CryptoJS.AES.decrypt(
            jeuneData?.additionalInfo?.email || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);
          const decryptedJeuneMobile = CryptoJS.AES.decrypt(
            jeuneData?.additionalInfo?.jeuneMobile || "",
            commonPass
          ).toString(CryptoJS.enc.Utf8);

          // attributes
          setNewFirstName(decryptedJeuneFirstName || "");
          setNewLastName(decryptedJeuneLastName || "");
          setNewInformation(jeuneData.additionalInfo.jeuneInformation || "");
          setNewGroup(jeuneData.additionalInfo.jeuneGroup || "");
          setNewMail(decryptedJeuneMail || "");
          setNewPassword(jeuneData.additionalInfo.jeunePassword);
          setNewMobile(decryptedJeuneMobile || "");
        } else {
          console.log("Aucune donnée trouvée pour ce jeune.");
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message
        );
      });
  }, [jeuneId]);

  const handleUpdate = () => {
    const encryptedJeuneFirstName = CryptoJS.AES.encrypt(
      newFirstName,
      commonPass
    ).toString();
    const encryptedJeuneLastName = CryptoJS.AES.encrypt(
      newLastName,
      commonPass
    ).toString();
    const encryptedJeuneMail = CryptoJS.AES.encrypt(
      newMail,
      commonPass
    ).toString();
    const encryptedJeuneMobile = CryptoJS.AES.encrypt(
      newMobile,
      commonPass
    ).toString();
    const jeuneRef = ref(database, `jeunes/${groupSelectorData}/${jeuneId}`);
    update(jeuneRef, {
      additionalInfo: {
        uid: jeuneId,
        jeuneFirstName: encryptedJeuneFirstName,
        jeuneLastName: encryptedJeuneLastName,
        jeuneInformation: newInformation,
        jeuneGroup: newGroup,
        email: encryptedJeuneMail,
        jeunePassword: newPassword,
        jeuneMobile: encryptedJeuneMobile,
        groupSelectorData: groupSelectorData,
        status: jeuneStatus,
      },
    })
      .then(() => {
        console.log("Jeune mis à jour avec succès !");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour du jeune :",
          error.message
        );
      });
  };

  return (
    <form className="popupModifyJeuneMainContainer">
      <div className="popupModifyJeune">
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
            un jeune
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
        <div className="popupModifyJeuneTop">
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

export default PopupModifyJeune;
