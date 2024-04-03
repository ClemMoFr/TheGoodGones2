import React, { useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import FirebaseConfig from "../../../../firebase/FirebaseConfig";
import CryptoJS from "crypto-js";

import "./PopupModifyContact.css";

import { AiFillCloseCircle } from "react-icons/ai";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupModifyContact = ({
  jeunesData,
  familyId,
  decryptField,
  handleRefreshFunction,
  handleModifyApplied,
  backArrowFunction,
}) => {
  const { database } = FirebaseConfig();

  const [jeunesSelected, setJeunesSelected] = useState(jeunesData.jeuneName);
  const [selectedJeune, setSelectedJeune] = useState("");
  const [familyData, setFamilyData] = useState({
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

  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  useEffect(() => {
    const familyRef = ref(database, `families/${familyId}`);
    get(familyRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const contactToModify = snapshot.val();
          const decryptedData = {
            familyName: decryptField(contactToModify.familyName),
            familyTelHome: decryptField(contactToModify.familyTelHome),
            familyAdress: decryptField(contactToModify.familyAdress),
            familyChildrens: contactToModify.familyChildrens,
            familyParents: {
              dad: {
                name: decryptField(contactToModify.familyParents.dad.name),
                mail: decryptField(contactToModify.familyParents.dad.mail),
                tel: decryptField(contactToModify.familyParents.dad.tel),
              },
              mum: {
                name: decryptField(contactToModify.familyParents.mum.name),
                mail: decryptField(contactToModify.familyParents.mum.mail),
                tel: decryptField(contactToModify.familyParents.mum.tel),
              },
            },
          };
          setFamilyData(decryptedData);
          setJeunesSelected(decryptedData.familyChildrens);
          if (jeunesData && jeunesData.length > 0) {
            setSelectedJeune(jeunesData[0].jeuneName);
          }
        } else {
          console.log("Family not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching family data:", error.message);
      });
  }, [familyId, jeunesData, decryptField]);

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

  const handleAddJeune = () => {
    if (!jeunesSelected) {
      setJeunesSelected([]);
    }

    if (selectedJeune) {
      const updatedJeunes = [...jeunesSelected, selectedJeune];
      setJeunesSelected(updatedJeunes);
      setSelectedJeune("");
    }
  };

  const handleRemoveJeune = (jeuneName) => {
    const updatedJeunes = jeunesSelected.filter((jeune) => jeune !== jeuneName);
    setJeunesSelected(updatedJeunes);
  };

  const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(data, commonPass);
    return encryptedData.toString();
  };

  const updateFamily = async () => {
    try {
      const familyRef = ref(database, `families/${familyId}`);
      const snapshot = await get(familyRef);

      if (snapshot.exists()) {
        const existingFamilyData = snapshot.val();

        const updatedFamilyData = {
          ...existingFamilyData,
          familyName: encryptData(familyData.familyName),
          familyTelHome: encryptData(familyData.familyTelHome),
          familyAdress: encryptData(familyData.familyAdress),
          familyChildrens: familyData.familyChildrens,
          familyParents: {
            dad: {
              name: encryptData(familyData.familyParents.dad.name),
              mail: encryptData(familyData.familyParents.dad.mail),
              tel: encryptData(familyData.familyParents.dad.tel),
            },
            mum: {
              name: encryptData(familyData.familyParents.mum.name),
              mail: encryptData(familyData.familyParents.mum.mail),
              tel: encryptData(familyData.familyParents.mum.tel),
            },
          },
          familyChildrens: jeunesSelected,
        };
        await set(familyRef, updatedFamilyData);
        setFamilyData(updatedFamilyData);
        handleModifyApplied();
        handleRefreshFunction();
      } else {
        console.log("Family not found");
      }
    } catch (error) {
      console.error("Error updating family data:", error.message);
    }
  };

  return (
    <div className="popupContactMainContainer">
      <BackArrow
        backArrowFunction={backArrowFunction}
        arrowPosition={"absolute"}
        xPosition={"20px"}
        yPosition={"-20px"}
        icon={"arrow"}
      />
      <div className="popupContactContactCard">
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
          <div
            className="popupAddContactInputContainer"
            style={{ marginRight: "10px" }}
          >
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
          <div>
            <label>Enfants</label>
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
                {jeunesData &&
                  jeunesData.map((jeune) => (
                    <option key={jeune.additionalInfo.jeuneFirstName}>
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
                  width: "50%",
                  marginLeft: "10px",
                  overflowX: "scroll",
                }}
              >
                {jeunesSelected &&
                  jeunesSelected.map((jeuneSelected) => (
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
              height: "185px",
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
                    height: "32px",
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
                    height: "32px",
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
                    height: "32px",
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
              height: "185px",
              marginRight: "10px",
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
                    height: "32px",
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
                    height: "32px",
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
                    height: "32px",
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
        <button onClick={updateFamily}>Modifier</button>
      </div>
    </div>
  );
};

export default PopupModifyContact;
