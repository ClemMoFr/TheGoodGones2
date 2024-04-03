import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, onValue, remove } from "firebase/database";
import CryptoJS from "crypto-js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useAuth } from "../../../firebase/AuthContext";
import "./Monos.css";

import { AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai";
import PopupDetailsMonos from "../../../components/Groupes/popup-details-monos/PopupDetailsMonos";
import PopupAddMonos from "../../../components/Groupes/popup-add-monos/PopupAddMonos";

const Monos = () => {
  const [groupSelector, setGroupSelector] = useState(true);
  const [groupSelectorData, setGroupSelectorData] = useState("gg");
  const [popupDetailsMono, setPopupDetailsMono] = useState(null);
  const [popupAddMono, setPopupAddMono] = useState(false);
  const [decryptedMonoFirstNames, setDecryptedMonoFirstNames] = useState([]);
  const [decryptedMonoLastNames, setDecryptedMonoLastNames] = useState([]);
  const [decryptedMonoMail, setDecryptedMonoMail] = useState([]);
  const [decryptedMonoMobile, setDecryptedMonoMobile] = useState([]);
  const [decryptedMonoPassword, setDecryptedMonoPassword] = useState("");

  function toggleGroup() {
    setGroupSelector(!groupSelector);
    const groupSelectorState = groupSelector === false ? "gg" : "mini-gg";
    setGroupSelectorData(groupSelectorState);
  }

  const { database } = FirebaseConfig();

  const [monos, setMonos] = useState([]);
  const [monoFirstName, setMonoFirstName] = useState("");
  const [monoLastName, setMonoLastName] = useState("");
  const [monoInformation, setMonoInformation] = useState("");
  const [monoGroup, setMonoGroupe] = useState("");
  const [monoMail, setMonoMail] = useState("");
  const [monoLoginMail, setMonoLoginMail] = useState("");
  const [monoPassword, setMonoPassword] = useState("");
  const [monoMobile, setMonoMobile] = useState("");

  useEffect(() => {
    const shortenedFirstName = monoFirstName.slice(0, 3).toLowerCase();
    const shortenedLastName = monoLastName.slice(0, 3).toLowerCase();
    setMonoLoginMail(
      `${shortenedFirstName}-${shortenedLastName}@mono-goodgones.fr`
    );
  }, [monoFirstName, monoLastName]);

  useEffect(() => {
    const dataRef = ref(database, `monos/${groupSelectorData}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setMonos(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setMonos([]);
      }
    });
    return () => unsubscribe();
  }, [database, groupSelectorData]);

  const secretPass = process.env.REACT_APP_ENCRYPTION_PASSWORD;

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  useEffect(() => {
    try {
      const decryptedMonoFirstNames = monos.map((mono) => {
        const bytes = CryptoJS.AES.decrypt(
          mono?.additionalInfo?.monoFirstName || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });
      const decryptedMonoLastNames = monos.map((mono) => {
        const bytes = CryptoJS.AES.decrypt(
          mono?.additionalInfo?.monoLastName || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });
      const decryptedMonoMail = monos.map((mono) => {
        const bytes = CryptoJS.AES.decrypt(
          mono?.additionalInfo?.email || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });
      const decryptedMonoMobile = monos.map((mono) => {
        const bytes = CryptoJS.AES.decrypt(
          mono?.additionalInfo?.monoMobile || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });

      setDecryptedMonoFirstNames(decryptedMonoFirstNames);
      setDecryptedMonoLastNames(decryptedMonoLastNames);
      setDecryptedMonoMail(decryptedMonoMail);
      setDecryptedMonoMobile(decryptedMonoMobile);
    } catch (error) {
      console.error("Erreur lors du déchiffrement :", error.message);
    }
  }, [monos, secretPass]);

  /*

  const secretPass = "YourSecretPassphrase";

  useEffect(() => {
    try {
      const decryptedMonoPassword = monos.map((mono) => {
        const bytes = CryptoJS.AES.decrypt(
          mono?.additionalInfo?.monoPassword || "",
          secretPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });
      setDecryptedMonoFirstNames(decryptedMonoPassword);
    } catch (error) {
      console.error("Erreur lors du déchiffrement :", error.message);
    }
  }, [monos, secretPass]);

  */

  const { userData, setActiveUser, currentUser } = useAuth();

  useEffect(() => {
    try {
      const bytes = CryptoJS.AES.decrypt(
        userData?.additionalInfo?.monoPassword || "",
        secretPass
      );
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      setDecryptedMonoPassword(decryptedData);
    } catch (error) {
      console.error(
        "Erreur lors du déchiffrement du mot de passe :",
        error.message
      );
    }
  }, [userData, secretPass]);

  let currentUserEmail = null;
  let currentUserPassword = null;

  if (currentUser) {
    currentUserEmail = currentUser.email;
    currentUserPassword = userData ? decryptedMonoPassword : null;
    const userId = currentUser.uid;
  } else {
    console.log("Aucun utilisateur n'est actuellement connecté");
  }

  const createFirebaseUserMono = async (email, password, additionalInfo) => {
    const { auth, database } = FirebaseConfig();
    try {
      console.log("Tentative de création de l'utilisateur...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      additionalInfo.uid = user.uid;

      const userRef = ref(database, `monos/${groupSelectorData}/${user.uid}`);
      await set(userRef, {
        email: monoLoginMail,
        additionalInfo: additionalInfo,
      });

      await loginUserWithOldData(currentUserEmail, currentUserPassword);

      return user;
    } catch (error) {
      console.error("Erreur de création d'utilisateur :", error);
      throw error;
    }
  };

  const addMono = async (e) => {
    const encryptedMonoPassword = CryptoJS.AES.encrypt(
      monoPassword,
      secretPass
    ).toString();
    const encryptedMonoFirstName = CryptoJS.AES.encrypt(
      monoFirstName,
      commonPass
    ).toString();
    const encryptedMonoLastName = CryptoJS.AES.encrypt(
      monoLastName,
      commonPass
    ).toString();
    const encryptedMonoMail = CryptoJS.AES.encrypt(
      monoMail,
      commonPass
    ).toString();
    const encryptedMonoMobile = CryptoJS.AES.encrypt(
      monoMobile,
      commonPass
    ).toString();
    try {
      const additionalInfo = {
        monoFirstName: encryptedMonoFirstName,
        monoLastName: encryptedMonoLastName,
        monoInformation: monoInformation,
        monoGroup: monoGroup,
        email: encryptedMonoMail,
        monoPassword: encryptedMonoPassword,
        monoMobile: encryptedMonoMobile,
        status: "monos",
        groupSelectorData: groupSelectorData,
      };

      const createdUser = await createFirebaseUserMono(
        monoLoginMail,
        monoPassword,
        additionalInfo
      );

      console.log("Utilisateur créé avec succès :", createdUser);

      e.preventDefault();

      setPopupAddMono(false);
      setMonoFirstName("");
      setMonoLastName("");
      setMonoInformation("");
      setMonoGroupe("");
      setMonoMail("");
      setMonoPassword("");
      setMonoMobile("");
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'utilisateur :",
        error.message
      );
    }
  };

  const loginUserWithOldData = async (
    currentUserEmail,
    currentUserPassword
  ) => {
    const { auth } = FirebaseConfig();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        currentUserEmail,
        currentUserPassword
      );
      const user = userCredential.user;

      setActiveUser(user);
    } catch (error) {
      console.error("Erreur de connexion :", error.message);
    }
  };

  const deleteMono = async (id) => {
    try {
      await remove(ref(database, `monos/${groupSelectorData}/${id}`));

      const updatedMonos = monos.filter((mono) => mono.id !== id);
      setMonos(updatedMonos);

      setPopupDetailsMono(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.message);
    }
  };

  return (
    <div className="monosMainContainer">
      <div className="monosTop">
        <div className="monosTopIcon"></div>
        <p className="monosTopTitle">Membres</p>
        <div className="monosSlideContainer" onClick={() => toggleGroup()}>
          <div
            className={`monosSlider ${
              groupSelector === true ? "gg-selected" : "mini-gg-selected"
            }`}
          >
            {groupSelector === true ? "GG" : "MINI-GG"}
          </div>
        </div>
      </div>
      <div className="monosBottom">
        <p className="sliderTitle">Monos</p>
        <div className="monosMemberContainer">
          <div className="btnAddMember">
            <p>Ajout d’un mono</p>
            <AiOutlineUserAdd size={70} color="#CBE4FF" />
            <button onClick={() => setPopupAddMono(true)}>Ajouter</button>
          </div>
          {monos.map((mono) => (
            <div className="cardMember" key={mono.id}>
              <AiOutlineUser size={70} color="#CBE4FF" />
              <p>
                {decryptedMonoFirstNames[monos.indexOf(mono)]}{" "}
                {decryptedMonoLastNames[monos.indexOf(mono)]}
              </p>
              <p onClick={() => setPopupDetailsMono(mono)}>détails</p>
            </div>
          ))}
          <div className="invisibilityCard" />
        </div>
      </div>

      {popupDetailsMono && (
        <PopupDetailsMonos
          monoId={popupDetailsMono.additionalInfo.uid}
          monoFirstName={
            decryptedMonoFirstNames[monos.indexOf(popupDetailsMono)]
          }
          monoLastName={decryptedMonoLastNames[monos.indexOf(popupDetailsMono)]}
          monoGroup={popupDetailsMono.additionalInfo.monoGroup}
          monoInfos={popupDetailsMono.additionalInfo.monoInformation}
          monosStatus={popupDetailsMono.additionalInfo.status}
          monoPhone={decryptedMonoMobile[monos.indexOf(popupDetailsMono)]}
          monoMail={decryptedMonoMail[monos.indexOf(popupDetailsMono)]}
          groupSelectorData={groupSelectorData}
          deleteMonoFunction={() => deleteMono(popupDetailsMono.id)}
          backArrowFunction={() => setPopupDetailsMono(null)}
        />
      )}
      {popupAddMono && (
        <PopupAddMonos
          valueMonoFirstName={monoFirstName}
          onChangeValueMonoFirstName={(e) => setMonoFirstName(e.target.value)}
          valueMonoLastName={monoLastName}
          onChangeValueMonoLastName={(e) => setMonoLastName(e.target.value)}
          valueMonoInformation={monoInformation}
          onChangeValueMonoInformation={(e) =>
            setMonoInformation(e.target.value)
          }
          valueMonoGroup={monoGroup}
          onChangeValueMonoGroup={(e) => setMonoGroupe(e.target.value)}
          valueMonoMail={monoMail}
          onChangeValueMonoMail={(e) => setMonoMail(e.target.value)}
          valueMonoPassword={monoPassword}
          onChangeValueMonoPassword={(e) => setMonoPassword(e.target.value)}
          valueMonoMobile={monoMobile}
          onChangeValueMonoMobile={(e) => setMonoMobile(e.target.value)}
          monoLoginMail={monoLoginMail}
          addMonoFunction={addMono}
          backArrowFunction={() => setPopupAddMono(false)}
        />
      )}
    </div>
  );
};

export default Monos;
