import React from "react";

import "./PopupAddActivity.css";
import BackArrow from "../../back-arrow/BackArrow";

const PopupAddActivite = ({
  valueActivitesTitleactivitesTitle,
  onChangeValueActivitesTitle,
  valueActivitesDescription,
  onChangeValueActivitesDescription,
  valueActivitesDuree,
  onChangeValueActivitesDuree,
  valueActivitesType,
  onChangeValueActivitesType,
  valueActivitesMin,
  onChangeValueActivitesMin,
  valueActivitesMax,
  onChangeValueActivitesMax,
  valueActivitesMateriel,
  onChangeValueActivitesMateriel,
  handleAddFunction,
  backArrowFunction,
}) => {
  return (
    <form
      className="popupAddActiviteMainContainer"
      onSubmit={handleAddFunction}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          margin: "10px 0px",
        }}
      >
        <p className="popupAddTitleJeune">
          Ajouter <br />
          une activité
        </p>
        <BackArrow
          backArrowFunction={backArrowFunction}
          arrowPosition={"absolute"}
          xPosition={"0px"}
          yPosition={"0px"}
          icon={"arrow"}
        />
      </div>
      <div className="line">
        <label style={{ width: "50%", marginRight: "10px" }}>
          titre de l'activité
          <input
            style={{
              width: "100%",
              borderRadius: "10px",
              height: "50px",
              backgroundColor: "#e7f0ff",
              border: "none",
            }}
            value={valueActivitesTitleactivitesTitle}
            onChange={onChangeValueActivitesTitle}
          ></input>
        </label>
        <label style={{ width: "50%" }}>
          type de jeux
          <div className="popupAddProgrammSelectContainer">
            <select
              style={{
                width: "100%",
                borderRadius: "40px",
                height: "50px",
              }}
              value={valueActivitesType}
              onChange={onChangeValueActivitesType}
            >
              <option>intérieur</option>
              <option>extérieur</option>
              <option>intérieur / extérieur</option>
            </select>
          </div>
        </label>
      </div>
      <div className="line">
        <label style={{ width: "60%", marginRight: "10px" }}>
          nombre de personnes
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            de{" "}
            <input
              style={{
                width: "30%",
                borderRadius: "10px",
                height: "50px",
                backgroundColor: "#e7f0ff",
                border: "none",
              }}
              value={valueActivitesMin}
              onChange={onChangeValueActivitesMin}
            ></input>
            à{" "}
            <input
              style={{
                width: "30%",
                borderRadius: "10px",
                height: "50px",
                backgroundColor: "#e7f0ff",
                border: "none",
              }}
              value={valueActivitesMax}
              onChange={onChangeValueActivitesMax}
            ></input>
          </div>
        </label>
        <label style={{ width: "40%" }}>
          Durée
          <div className="popupAddProgrammSelectContainer">
            <input
              style={{
                width: "100%",
                borderRadius: "10px",
                height: "50px",
                backgroundColor: "#e7f0ff",
                border: "none",
              }}
              value={valueActivitesDuree}
              onChange={onChangeValueActivitesDuree}
            ></input>
            <p style={{ marginLeft: "10px" }}>minutes</p>
          </div>
        </label>
      </div>
      <label style={{ width: "100%" }}>
        Matériel
        <div className="popupAddProgrammSelectContainer">
          <textarea
            style={{
              width: "100%",
              borderRadius: "10px",
              height: "10vh",
              backgroundColor: "#e7f0ff",
              border: "none",
            }}
            value={valueActivitesMateriel}
            onChange={onChangeValueActivitesMateriel}
          ></textarea>
        </div>
      </label>
      <label style={{ width: "100%" }}>
        Description
        <div className="popupAddProgrammSelectContainer">
          <textarea
            style={{
              width: "100%",
              borderRadius: "10px",
              height: "10vh",
              backgroundColor: "#e7f0ff",
              border: "none",
            }}
            value={valueActivitesDescription}
            onChange={onChangeValueActivitesDescription}
          ></textarea>
        </div>
      </label>
      <button type="submit">Créer</button>
    </form>
  );
};

export default PopupAddActivite;
