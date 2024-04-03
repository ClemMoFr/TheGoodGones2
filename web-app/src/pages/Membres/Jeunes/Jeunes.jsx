import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, onValue } from "firebase/database";
import CryptoJS from "crypto-js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useAuth } from "../../../firebase/AuthContext";
import "./Jeunes.css";

import { AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai";
import PopupDetailsJeune from "../../../components/Groupes/popup-details-jeune/PopupDetailsJeune";
import PopupAddJeune from "../../../components/Groupes/popup-add-jeune/PopupAddJeune";

const Jeunes = () => {
  const [groupSelector, setGroupSelector] = useState(true);
  const [groupSelectorData, setGroupSelectorData] = useState("gg");
  const [allergySelector, setAllergySelector] = useState(false);
  const [popupDetailsJeune, setPopupDetailsJeune] = useState(null);
  const [popupAddJeune, setPopupAddJeune] = useState(false);
  const [decryptedJeuneFirstNames, setDecryptedJeuneFirstNames] = useState([]);
  const [decryptedJeuneLastNames, setDecryptedJeuneLastNames] = useState([]);
  const [decryptedJeuneMail, setDecryptedJeuneMail] = useState([]);
  const [decryptedJeuneMobile, setDecryptedJeuneMobile] = useState([]);
  const [decryptedMonoPassword, setDecryptedMonoPassword] = useState("");

  function toggleGroup() {
    setGroupSelector(!groupSelector);
    const groupSelectorState = groupSelector === false ? "gg" : "mini-gg";
    setGroupSelectorData(groupSelectorState);
  }

  function toggleAllergy() {
    setAllergySelector(!allergySelector);
  }

  const { database } = FirebaseConfig();

  const [jeunes, setJeunes] = useState([]);
  const [jeuneFirstName, setJeuneFirstName] = useState("");
  const [jeuneLastName, setJeuneLastName] = useState("");
  const [jeuneInformation, setJeuneInformation] = useState("");
  const [jeuneGroup, setJeuneGroupe] = useState("");
  const [jeuneMail, setJeuneMail] = useState("");
  const [jeuneLoginMail, setJeuneLoginMail] = useState("");
  const [jeunePassword, setJeunePassword] = useState("");
  const [jeuneMobile, setJeuneMobile] = useState("");

  const filteredJeunes = jeunes.filter((jeune) => {
    const hasJeuneInformation =
      jeune.additionalInfo.jeuneInformation.trim() !== "";
    return allergySelector ? hasJeuneInformation : true;
  });

  useEffect(() => {
    const shortenedFirstName = jeuneFirstName.slice(0, 3).toLowerCase();
    const shortenedLastName = jeuneLastName.slice(0, 3).toLowerCase();
    setJeuneLoginMail(
      `${shortenedFirstName}-${shortenedLastName}@goodgones.fr`
    );
  }, [jeuneFirstName, jeuneLastName]);

  useEffect(() => {
    const dataRef = ref(database, `jeunes/${groupSelectorData}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setJeunes(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setJeunes([]);
      }
    });

    return () => unsubscribe();
  }, [database, groupSelectorData]);

  const secretPass = process.env.REACT_APP_ENCRYPTION_PASSWORD;

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  useEffect(() => {
    try {
      const decryptedJeuneFirstNames = jeunes.map((jeune) => {
        const bytes = CryptoJS.AES.decrypt(
          jeune?.additionalInfo?.jeuneFirstName || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });
      const decryptedJeuneLastNames = jeunes.map((jeune) => {
        const bytes = CryptoJS.AES.decrypt(
          jeune?.additionalInfo?.jeuneLastName || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });
      const decryptedJeuneMail = jeunes.map((jeune) => {
        const bytes = CryptoJS.AES.decrypt(
          jeune?.additionalInfo?.email || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });
      const decryptedJeuneMobile = jeunes.map((jeune) => {
        const bytes = CryptoJS.AES.decrypt(
          jeune?.additionalInfo?.jeuneMobile || "",
          commonPass
        );
        return bytes.toString(CryptoJS.enc.Utf8);
      });

      setDecryptedJeuneFirstNames(decryptedJeuneFirstNames);
      setDecryptedJeuneLastNames(decryptedJeuneLastNames);
      setDecryptedJeuneMail(decryptedJeuneMail);
      setDecryptedJeuneMobile(decryptedJeuneMobile);
    } catch (error) {
      console.error("Erreur lors du déchiffrement :", error.message);
    }
  }, [jeunes, secretPass]);

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
  const createFirebaseUser = async (email, password, additionalInfo) => {
    const { auth, database } = FirebaseConfig();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      additionalInfo.uid = user.uid;

      const userRef = ref(database, `jeunes/${groupSelectorData}/${user.uid}`);
      await set(userRef, {
        email: jeuneLoginMail,
        additionalInfo: additionalInfo,
      });

      await loginUserWithOldData(currentUserEmail, currentUserPassword);

      return user;
    } catch (error) {
      console.error("Erreur de création d'utilisateur :", error.message);
      throw error;
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

  const addJeune = async (e) => {
    const encryptedJeunePassword = CryptoJS.AES.encrypt(
      jeunePassword,
      secretPass
    ).toString();
    const encryptedJeuneFirstName = CryptoJS.AES.encrypt(
      jeuneFirstName,
      commonPass
    ).toString();
    const encryptedJeuneLastName = CryptoJS.AES.encrypt(
      jeuneLastName,
      commonPass
    ).toString();
    const encryptedJeuneMail = CryptoJS.AES.encrypt(
      jeuneMail,
      commonPass
    ).toString();
    const encryptedJeuneMobile = CryptoJS.AES.encrypt(
      jeuneMobile,
      commonPass
    ).toString();

    try {
      const additionalInfo = {
        jeuneFirstName: encryptedJeuneFirstName,
        jeuneLastName: encryptedJeuneLastName,
        jeuneInformation: jeuneInformation,
        jeuneGroup: jeuneGroup,
        email: encryptedJeuneMail,
        jeunePassword: encryptedJeunePassword,
        jeuneMobile: encryptedJeuneMobile,
        status: "jeune",
        groupSelectorData: groupSelectorData,
      };

      await createFirebaseUser(jeuneLoginMail, jeunePassword, additionalInfo);

      console.log("Utilisateur créé avec succès !");

      e.preventDefault();

      setPopupAddJeune(false);
      setJeuneFirstName("");
      setJeuneLastName("");
      setJeuneInformation("");
      setJeuneGroupe("");
      setJeuneMail("");
      setJeunePassword("");
      setJeuneMobile("");
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'utilisateur :",
        error.message
      );
    }
  };

  return (
    <div className="jeunesMainContainer">
      <div className="jeunesTop">
        <div className="jeunesTopIcon"></div>
        <p className="jeunesTopTitle">Membres</p>
        <div className="jeunesSlideContainer" onClick={() => toggleGroup()}>
          <div
            className={`jeunesSlider ${
              groupSelector === true ? "gg-selected" : "mini-gg-selected"
            }`}
          >
            {groupSelector === true ? "GG" : "MINI-GG"}
          </div>
        </div>
      </div>
      <div className="jeunesBottom">
        <div className="allergySliderContainer" onClick={() => toggleAllergy()}>
          <div
            className={`allergySlider  ${
              allergySelector === true
                ? "allergy-selected"
                : "allergy-not-selected"
            }`}
          >
            {" "}
            {allergySelector === true ? "Allergies" : "Tous"}
          </div>
        </div>
        <p className="sliderTitle">Tous les jeunes</p>
        <div className="jeunesMemberContainer">
          <div className="btnAddMember">
            <p>Ajout d’un jeune</p>
            <AiOutlineUserAdd size={70} color="#CBE4FF" />
            <button onClick={() => setPopupAddJeune(true)}>Ajouter</button>
          </div>
          {filteredJeunes.map((jeune) => (
            <div className="cardMember" key={jeune.id}>
              <AiOutlineUser size={70} color="#CBE4FF" />
              <p>
                {decryptedJeuneFirstNames[filteredJeunes.indexOf(jeune)]}{" "}
                {decryptedJeuneLastNames[filteredJeunes.indexOf(jeune)]}
              </p>
              <p
                onClick={() => {
                  setPopupDetailsJeune(jeune);
                }}
              >
                détails
              </p>
            </div>
          ))}

          <div className="invisibilityCard" />
        </div>
      </div>

      {popupDetailsJeune && (
        <PopupDetailsJeune
          jeuneId={popupDetailsJeune.additionalInfo.uid}
          jeuneFirstName={
            decryptedJeuneFirstNames[jeunes.indexOf(popupDetailsJeune)]
          }
          jeuneLastName={
            decryptedJeuneLastNames[jeunes.indexOf(popupDetailsJeune)]
          }
          jeuneGroup={popupDetailsJeune.additionalInfo.jeuneGroup}
          jeuneInfos={popupDetailsJeune.additionalInfo.jeuneInformation}
          jeuneStatus={popupDetailsJeune.additionalInfo.status}
          jeunePhone={decryptedJeuneMobile[jeunes.indexOf(popupDetailsJeune)]}
          jeuneMail={decryptedJeuneMail[jeunes.indexOf(popupDetailsJeune)]}
          jeuneModifyPassword={popupDetailsJeune.additionalInfo.password}
          groupSelectorData={groupSelectorData}
          backArrowFunction={() => setPopupDetailsJeune(null)}
        />
      )}
      {popupAddJeune && (
        <PopupAddJeune
          valueJeuneFirstName={jeuneFirstName}
          onChangeValueJeuneFirstName={(e) => setJeuneFirstName(e.target.value)}
          valueJeuneLastName={jeuneLastName}
          onChangeValueJeuneLastName={(e) => setJeuneLastName(e.target.value)}
          valueJeuneInformation={jeuneInformation}
          onChangeValueJeuneInformation={(e) =>
            setJeuneInformation(e.target.value)
          }
          valueJeuneGroup={jeuneGroup}
          onChangeValueJeuneGroup={(e) => setJeuneGroupe(e.target.value)}
          valueJeuneMail={jeuneMail}
          onChangeValueJeuneMail={(e) => setJeuneMail(e.target.value)}
          valueJeunePassword={jeunePassword}
          onChangeValueJeunePassword={(e) => setJeunePassword(e.target.value)}
          valueJeuneMobile={jeuneMobile}
          onChangeValueJeuneMobile={(e) => setJeuneMobile(e.target.value)}
          jeuneLoginMail={jeuneLoginMail}
          addJeuneFunction={addJeune}
          backArrowFunction={() => setPopupAddJeune(false)}
        />
      )}
    </div>
  );
};

export default Jeunes;
