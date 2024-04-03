import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../../firebase/FirebaseConfig";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

import CryptoJS from "crypto-js";

import "./PopupAddContact.css";

import { AiFillCloseCircle } from "react-icons/ai";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupAddContact = ({
  jeunesData,
  decryptField,
  handleRefreshFunction,
  backArrowFunction,
}) => {
  const [jeunesSelected, setJeunesSelected] = useState([]);
  const [selectedJeune, setSelectedJeune] = useState("");

  const { database } = FirebaseConfig();

  const [familyData, setFamilyData] = useState({
    id: uuidv4(),
    familyName: "",
    familyTelHome: "",
    familyAdress: "",
    familyChildrens: [],
    familyParents: {
      dad: {
        name: "",
        mail: "",
        tel: "",
      },
      mum: {
        name: "",
        mail: "",
        tel: "",
      },
    },
  });

  const handleInputChange = (key, value) => {
    setFamilyData({
      ...familyData,
      [key]: value,
    });
  };

  const handleParentInputChange = (parentKey, key, value) => {
    setFamilyData((prevData) => ({
      ...prevData,
      familyParents: {
        ...prevData.familyParents,
        [parentKey]: {
          ...prevData.familyParents[parentKey],
          [key]: value,
        },
      },
    }));
  };

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(data, commonPass);
    return encryptedData.toString();
  };

  const createFamily = async () => {
    const familyId = uuidv4();
    const dadData = familyData.familyParents.dad || {};
    const mumData = familyData.familyParents.mum || {};

    // Données de la famille à chiffrer
    const encryptedData = {
      id: familyId,
      familyName: encryptData(familyData.familyName),
      familyTelHome: encryptData(familyData.familyTelHome),
      familyAdress: encryptData(familyData.familyAdress),
      familyChildrens: familyData.familyChildrens,
      familyParents: {
        dad: {
          name: encryptData(dadData.name || ""),
          mail: encryptData(dadData.mail || ""),
          tel: encryptData(dadData.tel || ""),
        },
        mum: {
          name: encryptData(mumData.name || ""),
          mail: encryptData(mumData.mail || ""),
          tel: encryptData(mumData.tel || ""),
        },
      },
    };

    set(ref(database, `families/${familyId}`), encryptedData);

    backArrowFunction();
    handleRefreshFunction();
  };

  const handleAddJeune = () => {
    if (selectedJeune) {
      const updatedJeunes = [...jeunesSelected];
      updatedJeunes.push(selectedJeune);
      setJeunesSelected(updatedJeunes);
      setSelectedJeune("");
    }
  };

  const handleRemoveJeune = (jeuneName) => {
    const updatedJeunes = jeunesSelected.filter((jeune) => jeune !== jeuneName);
    setJeunesSelected(updatedJeunes);
  };

  useEffect(() => {
    setFamilyData({
      ...familyData,
      familyChildrens: jeunesSelected,
    });
  }, [jeunesSelected]);
  return (
    <div className="popupContactMainContainer">
      <BackArrow
        backArrowFunction={backArrowFunction}
        arrowPosition={"absolute"}
        xPosition={"20px"}
        yPosition={"10px"}
        icon={"arrow"}
      />
      <div className="popupContactCard">
        <div className="line">
          <label style={{ width: "50%" }}>
            nom de la famille
            <div
              className="popupAddContactInputContainer"
              style={{ marginRight: "10px" }}
            >
              <input
                value={familyData.familyName}
                onChange={(e) =>
                  handleInputChange("familyName", e.target.value)
                }
                style={{
                  width: "100%",
                  borderRadius: "40px",
                  paddingLeft: "10px",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  color: "#b5d6ff",
                }}
              ></input>
            </div>
          </label>
          <label style={{ width: "50%" }}>
            tel fixe
            <div className="popupAddContactInputContainer">
              <input
                value={familyData.familyTelHome}
                onChange={(e) =>
                  handleInputChange("familyTelHome", e.target.value)
                }
                style={{
                  width: "100%",
                  borderRadius: "40px",
                  paddingLeft: "10px",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  color: "#b5d6ff",
                }}
              ></input>
            </div>
          </label>
        </div>
        <label style={{ width: "100%" }}>
          adresse de la famille
          <div className="popupAddContactInputContainer">
            <input
              value={familyData.familyAdress}
              onChange={(e) =>
                handleInputChange("familyAdress", e.target.value)
              }
              style={{
                width: "100%",
                borderRadius: "40px",
                paddingLeft: "10px",
                fontSize: "1.2rem",
                fontWeight: "700",
                color: "#b5d6ff",
              }}
            ></input>
          </div>
        </label>
        <label style={{ width: "100%" }}>
          lien enfant
          <div className="popupAddContactInputContainer">
            <div
              style={{
                width: "100%",
                borderRadius: "5px",
                backgroundColor: "#E7F0FF",
                height: "70px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  padding: "0px 10px",
                  alignItems: "center",
                }}
              >
                <select
                  style={{
                    width: "40%",
                    marginRight: "10px",
                    height: "40px",
                    borderRadius: "20px",
                    border: "none",
                    backgroundColor: "#CFE0FD",
                    color: "white",
                    fontWeight: "700",
                    paddingLeft: "20px",
                  }}
                  value={selectedJeune}
                  onChange={(e) => setSelectedJeune(e.target.value)}
                >
                  <option>Sélectionner un jeune</option>
                  {jeunesData.map((jeune) => (
                    <option>
                      {decryptField(jeune.additionalInfo.jeuneFirstName)}
                    </option>
                  ))}
                </select>
                <button
                  style={{
                    height: "40px",
                    color: "#ffffff",
                    borderRadius: "40px",
                    backgroundColor: "#5590F2",
                    fontWeight: "700",
                    fontSize: "1rem",
                    border: "none",
                    padding: "0px 10px",
                  }}
                  onClick={handleAddJeune}
                >
                  Ok
                </button>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    width: "80%",
                    marginLeft: "10px",
                    overflowX: "scroll",
                  }}
                >
                  {jeunesSelected.map((jeuneSelected) => (
                    <div
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#c6253d",
                        color: "white",
                        fontWeight: "700",
                        borderRadius: "30px",
                        marginRight: "10px",
                        position: "relative",
                      }}
                      key={jeuneSelected}
                    >
                      {jeuneSelected}
                      <AiFillCloseCircle
                        style={{
                          position: "absolute",
                          top: "0px",
                          width: "20px",
                          height: "20px",
                        }}
                        onClick={() => handleRemoveJeune(jeuneSelected)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </label>
        <div
          className="line"
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              width: "50%",
              marginRight: "10px",
            }}
          >
            <label>père</label>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#E7F0FF",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                padding: "20px",
              }}
            >
              <label>
                Prénom
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "20px",
                    background: "#CFE0FD",
                    border: "none",
                    paddingLeft: "10px",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#b5d6ff",
                  }}
                  value={familyData.familyParents.dad.name}
                  onChange={(e) =>
                    handleParentInputChange("dad", "name", e.target.value)
                  }
                ></input>
              </label>
              <label>
                Adresse mail
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "20px",
                    background: "#CFE0FD",
                    border: "none",
                    paddingLeft: "10px",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#b5d6ff",
                  }}
                  value={familyData.familyParents.dad.mail}
                  onChange={(e) =>
                    handleParentInputChange("dad", "mail", e.target.value)
                  }
                ></input>
              </label>
              <label>
                Mobile
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "20px",
                    background: "#CFE0FD",
                    border: "none",
                    paddingLeft: "10px",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#b5d6ff",
                  }}
                  value={familyData.familyParents.dad.tel}
                  onChange={(e) =>
                    handleParentInputChange("dad", "tel", e.target.value)
                  }
                ></input>
              </label>
            </div>
          </div>
          <div
            style={{
              width: "50%",
            }}
          >
            <label>mère</label>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#E7F0FF",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                padding: "20px",
              }}
            >
              <label>
                Prénom
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "20px",
                    background: "#CFE0FD",
                    border: "none",
                    paddingLeft: "10px",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#b5d6ff",
                  }}
                  value={familyData.familyParents.mum.name}
                  onChange={(e) =>
                    handleParentInputChange("mum", "name", e.target.value)
                  }
                ></input>
              </label>
              <label>
                Adresse mail
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "20px",
                    background: "#CFE0FD",
                    border: "none",
                    paddingLeft: "10px",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#b5d6ff",
                  }}
                  value={familyData.familyParents.mum.mail}
                  onChange={(e) =>
                    handleParentInputChange("mum", "mail", e.target.value)
                  }
                ></input>
              </label>
              <label>
                Mobile
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "20px",
                    background: "#CFE0FD",
                    border: "none",
                    paddingLeft: "10px",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#b5d6ff",
                  }}
                  value={familyData.familyParents.mum.tel}
                  onChange={(e) =>
                    handleParentInputChange("mum", "tel", e.target.value)
                  }
                ></input>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="popupContactContactButtonContainer">
        <button onClick={createFamily}>Créer</button>
      </div>
    </div>
  );
};

export default PopupAddContact;
