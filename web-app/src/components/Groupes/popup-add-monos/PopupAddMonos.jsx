import React from "react";

import "./PopupAddMonos.css";

import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { BiSolidLock } from "react-icons/bi";
import { CgKey } from "react-icons/cg";
import { AiOutlineUser } from "react-icons/ai";
import BackArrow from "../../back-arrow/BackArrow";

const PopupAddMonos = ({
  valueMonoFirstName,
  valueMonoLastName,
  valueMonoInformation,
  valueMonoGroup,
  valueMonoMail,
  valueMonoPassword,
  valueMonoMobile,
  onChangeValueMonoFirstName,
  onChangeValueMonoLastName,
  onChangeValueMonoInformation,
  onChangeValueMonoGroup,
  onChangeValueMonoMail,
  onChangeValueMonoPassword,
  onChangeValueMonoMobile,
  monoLoginMail,
  addMonoFunction,
  backArrowFunction,
}) => {
  return (
    <form className="popupAddMonosMainContainer">
      <div className="popupAddMonos">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p className="popupAddTitleJeune">
            Ajouter <br />
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
          style={{ margin: "auto", width: "100%" }}
          size={70}
          color="#CBE4FF"
        />
        <div className="popupAddMonosTop">
          <label style={{ width: "50%", marginRight: "20px" }}>
            Prénom
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueMonoFirstName}
              onChange={onChangeValueMonoFirstName}
            />
          </label>
          <label style={{ width: "50%" }}>
            Nom
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueMonoLastName}
              onChange={onChangeValueMonoLastName}
            />
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Informations importantes
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={valueMonoInformation}
              onChange={onChangeValueMonoInformation}
            />
          </label>
        </div>
        <label className="inputRow">
          <span>
            <BsFillTelephoneFill size={25} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={valueMonoMobile}
            onChange={onChangeValueMonoMobile}
          />
        </label>
        <label className="inputRow">
          <span>
            <IoMdMail size={25} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={valueMonoMail}
            onChange={onChangeValueMonoMail}
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
            value={monoLoginMail}
          ></input>
        </label>
        <label className="inputRow">
          <span>
            <BiSolidLock size={30} color="#c6253d" />
          </span>
          <input
            style={{ width: "100%", marginLeft: "20px" }}
            value={valueMonoPassword}
            onChange={onChangeValueMonoPassword}
          />
        </label>
        <button type="button" onClick={addMonoFunction}>
          Ajouter
        </button>
      </div>
    </form>
  );
};

export default PopupAddMonos;
