import React, { useEffect } from "react";
import "./Navbar.css";
import { BsHouseFill } from "react-icons/bs";
import { PiPiggyBankFill, PiHandsPrayingFill } from "react-icons/pi";
import { BsFilePersonFill } from "react-icons/bs";
import { FaBookBible } from "react-icons/fa6";
import { VscBook } from "react-icons/vsc";
import { AiTwotoneSetting } from "react-icons/ai";
import { GrCluster } from "react-icons/gr";
import { FaCalendarDays } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

const Navbar = () => {
  const location = useLocation();

  const host = "TheGoodGones";

  const isLinkActive = (path) => {
    if (path === `/${host}/`) {
      return location.pathname === `/${host}/`;
    }
    return location.pathname.startsWith(`${path}`);
  };

  const { userData } = useAuth();

  if (!userData) {
    return <div></div>;
  }

  return (
    <>
      {userData.additionalInfo.status === "admin" && (
        <>
          <div className="navbarMainContainer">
            <Link to={`/${host}/`}>
              <BsHouseFill
                className={`iconNavbar ${
                  isLinkActive(host ? `/${host}/` : "/") ? "activeNavbar" : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/budget`}>
              <PiPiggyBankFill
                className={`iconNavbar ${
                  isLinkActive(`/${host}/budget`) ? "activeNavbar" : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/membres`}>
              <BsFilePersonFill
                className={`iconNavbar ${
                  isLinkActive(`/${host}/membres`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
            <Link to={`/${host}/etudes`}>
              <FaBookBible
                className={`iconNavbar ${
                  isLinkActive(`/${host}/etudes`) ? "activeNavbar" : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/gestion`}>
              <GrCluster
                className={`iconNavbar ${
                  isLinkActive(`/${host}/gestion`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
            <Link to={`/${host}/parametres`}>
              <AiTwotoneSetting
                className={`iconNavbar ${
                  isLinkActive(`/${host}/parametres`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
          </div>
        </>
      )}

      {userData.additionalInfo.status === "monos" && (
        <>
          <div className="navbarMainContainer">
            <Link to={`/${host}/`}>
              <BsHouseFill
                className={`iconNavbar ${
                  isLinkActive(`/${host}/`) ? "activeNavbar" : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/membres`}>
              <BsFilePersonFill
                className={`iconNavbar ${
                  isLinkActive(`/${host}/membres`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
            <Link to={`/${host}/etudes`}>
              <FaBookBible
                className={`iconNavbar ${
                  isLinkActive(`/${host}/etudes`) ? "activeNavbar" : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/gestion`}>
              <GrCluster
                className={`iconNavbar ${
                  isLinkActive(`/${host}/gestion`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
            <Link to={`/${host}/parametres`}>
              <AiTwotoneSetting
                className={`iconNavbar ${
                  isLinkActive(`/${host}/parametres`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
          </div>
        </>
      )}

      {userData.additionalInfo.status === "jeune" && (
        <>
          <div className="navbarMainContainer">
            <Link to={`/${host}/`}>
              <BsHouseFill
                className={`iconNavbar ${
                  isLinkActive(`/${host}/`) ? "activeNavbar" : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/mes-etudes`}>
              <FaBookBible
                className={`iconNavbar ${
                  isLinkActive(`/${host}/mes-etudes`) ? "activeNavbar" : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/mes-prieres`}>
              <PiHandsPrayingFill
                className={`iconNavbar ${
                  isLinkActive(`/${host}/mes-prieres`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
            <Link to={`/${host}/mes-versets-favoris`}>
              <VscBook
                className={`iconNavbar ${
                  isLinkActive(`/${host}/mes-versets-favoris`)
                    ? "activeNavbar"
                    : ""
                }`}
              />
            </Link>

            <Link to={`/${host}/futurs-evenements`}>
              <FaCalendarDays
                className={`iconNavbar ${
                  isLinkActive(`/${host}/futurs-evenements`)
                    ? "activeNavbar"
                    : ""
                }`}
              />
            </Link>
            <Link to={`/${host}/parametres`}>
              <AiTwotoneSetting
                className={`iconNavbar ${
                  isLinkActive(`/${host}/parametres`) ? "activeNavbar" : ""
                }`}
              />
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
