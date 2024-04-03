import React from "react";

import "./PopupAddJeune.css";

import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { BiSolidLock } from "react-icons/bi";
import { CgKey } from "react-icons/cg";
import { AiOutlineUser } from "react-icons/ai";
import BackArrow from "../../back-arrow/BackArrow";

const PopupAddJeune = ({
  valueJeuneFirstName,
  valueJeuneLastName,
  valueJeuneInformation,
  valueJeuneGroup,
  valueJeuneMail,
  valueJeunePassword,
  valueJeuneMobile,
  onChangeValueJeuneFirstName,
  onChangeValueJeuneLastName,
  onChangeValueJeuneInformation,
  onChangeValueJeuneGroup,
  onChangeValueJeuneMail,
  onChangeValueJeunePassword,
  onChangeValueJeuneMobile,
  jeuneLoginMail,
  addJeuneFunction,
  backArrowFunction,
}) => {
  return (
    <form className="popupAddJeuneMainContainer">
      <div className="popupAddJeune">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="popupAddTitleJeune">
            Ajouter <br />
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
          style={{ margin: "auto", width: "100%" }}
          size={70}
          color="#CBE4FF"
        />
        <div className="popupAddJeuneTop">
          <label style={{ width: "50%", marginRight: "20px" }}>
            Prénom
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueJeuneFirstName}
              onChange={onChangeValueJeuneFirstName}
            />
          </label>
          <label style={{ width: "50%" }}>
            Nom
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueJeuneLastName}
              onChange={onChangeValueJeuneLastName}
            />
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Informations importantes
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueJeuneInformation}
              onChange={onChangeValueJeuneInformation}
            />
          </label>
        </div>
        <label className="inputRow">
          <span>
            <BsFillTelephoneFill size={25} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={valueJeuneMobile}
            onChange={onChangeValueJeuneMobile}
          />
        </label>
        <label className="inputRow">
          <span>
            <IoMdMail size={25} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={valueJeuneMail}
            onChange={onChangeValueJeuneMail}
          />
        </label>
        <label className="inputRow">
          <span style={{ position: "relative" }}>
            <IoMdMail size={25} color="#c6253d" />
            <CgKey
              style={{
                position: "absolute",
                bottom: "11px",
                right: "1px",
                color: "white",
                transform: "rotate(-35deg)",
              }}
              size={12}
            />
          </span>
          <input
            disabled
            style={{
              width: "100%",
              marginLeft: "20px",
              backgroundColor: "white",
            }}
            value={jeuneLoginMail}
          ></input>
        </label>
        <label className="inputRow">
          <span>
            <BiSolidLock size={30} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={valueJeunePassword}
            onChange={onChangeValueJeunePassword}
          />
        </label>
        <button type="button" onClick={addJeuneFunction}>
          Ajouter
        </button>
      </div>
    </form>
  );
};

export default PopupAddJeune;
