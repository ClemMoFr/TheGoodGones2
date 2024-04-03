import React, { useState, useEffect } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import "./MultiSelect.css";
import CryptoJS from "crypto-js"; // Import CryptoJS for AES encryption/decryption

const MultiSelect = ({
  storageKey,
  dataWanted,
  onSelect,
  hexaBackground,
  dataValueLocalStorage,
  onSameForm,
  multiSelectNumber,
  needFlexWrap,
  options,
  elementOnLocalStorage,
}) => {
  const [data, setData] = useState(options);
  const [list, setList] = useState(false);
  const [hasBeenModified, setHasBeenModified] = useState(false);
  const [selectedUids, setSelectedUids] = useState([]);
  const [multiSelectNumberState, setMultiSelectNumberState] = useState("");
  const commonPass = process.env.REACT_APP_ENCRYPTION_COMMON;

  // Fonction pour décrypter un champ chiffré
  const decryptField = (encryptedField) => {
    if (!encryptedField) return ""; // Si le champ chiffré est vide, retourner une chaîne vide

    // Déchiffrer le champ avec la clé de chiffrement
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedField, commonPass);
    const decryptedField = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return decryptedField;
  };

  const closeList = (e) => {
    e.stopPropagation();
    setList(false);
    setHasBeenModified(true);
  };

  const onSameFormFunction = (e) => {
    e.stopPropagation();
    setList(true);
    setMultiSelectNumberState(multiSelectNumber);
  };

  const handleCheckboxChange = (option) => {
    if (!option.additionalInfo) return; // Vérifier si additionalInfo existe

    const monoFirstName =
      option.additionalInfo.monoFirstName ||
      option.additionalInfo.jeuneFirstName;
    const updatedSelectedUids = selectedUids.includes(monoFirstName)
      ? selectedUids.filter((selectedUid) => selectedUid !== monoFirstName)
      : [...selectedUids, monoFirstName];

    if (onSelect) {
      onSelect(updatedSelectedUids);
    }

    setSelectedUids(updatedSelectedUids);
  };

  useEffect(() => {
    setData(options);
    setSelectedUids([]);
  }, [options]);

  const filteredData = data.filter((option) => {
    const monoFirstName =
      option.additionalInfo.monoFirstName ||
      option.additionalInfo.jeuneFirstName;
    return (
      selectedUids.includes(monoFirstName) &&
      (onSameForm === false ||
        (onSameForm === true && multiSelectNumberState === multiSelectNumber))
    );
  });

  return (
    <div style={{ width: "100%" }}>
      <div
        className="multiSelectContainer"
        style={{ backgroundColor: hexaBackground }}
        onClick={(e) => {
          if (onSameForm) {
            onSameFormFunction(e);
          } else {
            setList(true);
          }
        }}
      >
        {list && (
          <div className="multiSelectOptionMainContainer">
            <div className="multiSelectOptionCardOptionContainer">
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  marginTop: "10px",
                }}
              >
                Liste des {storageKey}
              </p>
              <div
                style={{
                  overflowY: "scroll",
                  width: "100%",
                  height: "100%",
                }}
              >
                {data.map((option) => (
                  <label
                    key={option.additionalInfo.uid}
                    className="multiSelectOptionContainer"
                    onClick={() => handleCheckboxChange(option)}
                  >
                    <BsFillCheckCircleFill
                      size={20}
                      style={{
                        color: selectedUids.includes(
                          option.additionalInfo.monoFirstName ||
                            option.additionalInfo.jeuneFirstName
                        )
                          ? "#7BB2F7"
                          : "grey",
                        marginRight: "10px",
                      }}
                    />
                    <p
                      style={{
                        color: selectedUids.includes(
                          option.additionalInfo.monoFirstName ||
                            option.additionalInfo.jeuneFirstName
                        )
                          ? "#7BB2F7"
                          : "grey",
                        fontWeight: 500,
                      }}
                    >
                      {decryptField(
                        option.additionalInfo.monoFirstName ||
                          option.additionalInfo.jeuneFirstName
                      )}
                    </p>
                  </label>
                ))}
              </div>
              <div className="btnClosePopuplist" onClick={(e) => closeList(e)}>
                ok
              </div>
            </div>
          </div>
        )}
        <p> liste des {storageKey} </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          overflowX: "scroll",
          flexWrap: needFlexWrap ? "nowrap" : "wrap",
        }}
      >
        {filteredData.map((option) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "5px 10px",
              backgroundColor: "#c6253d",
              color: "white",
              borderRadius: "30px",
              marginRight: "10px",
              marginTop: needFlexWrap ? "0px" : "10px",
              marginBottom: needFlexWrap ? "0px" : "10px",
              whiteSpace: "nowrap",
            }}
            key={
              option.additionalInfo.monoFirstName ||
              option.additionalInfo.jeuneFirstName
            }
          >
            {decryptField(
              option.additionalInfo.monoFirstName ||
                option.additionalInfo.jeuneFirstName
            )}
          </div>
        ))}

        {list === false && hasBeenModified === false && elementOnLocalStorage}
      </div>
    </div>
  );
};

export default MultiSelect;
