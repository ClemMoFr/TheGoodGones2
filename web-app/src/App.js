import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import RoutesPaths from "./config/RoutesPaths";
import Navbar from "./components/navbar/Navbar";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import TutoSlider from "./components/tuto-slider/TutoSlider";
import { AuthProvider, useAuth } from "./firebase/AuthContext";
import PleaseLogin from "./components/please-login/PleaseLogin";
import PleaseMobile from "./components/please-mobile/PleaseMobile";

function App() {
  const [isDesktop, setIsDestop] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("pageReloaded") === "true"
  );

  function useRedirectionIfNecessary(userData) {
    useEffect(() => {
      const utilisateurEstFonctionnaire =
        userData && userData.additionalInfo.status === "jeune";
      const cheminActuel = window.location.pathname;
      const cheminsAExclureStartWith = [
        "/membres",
        "/budget",
        "/gestion",
        "/activites",
      ];
      const cheminsAExclureSpecial = ["/etudes", "/etudes/etudes-generales"];
      if (
        utilisateurEstFonctionnaire &&
        (cheminsAExclureStartWith.some((chemin) =>
          cheminActuel.startsWith(chemin)
        ) ||
          cheminsAExclureSpecial.some((chemin) =>
            cheminActuel.includes(chemin)
          ))
      ) {
        window.location.href = "/";
      }

      if (window.innerWidth >= 768) {
        setIsDestop(true);
      } else {
        setIsDestop(false);
      }
    }, [userData]);
  }

  const [showTutoSlider, setShowTutoSlider] = useState(true);

  const handleLogout = () => {
    localStorage.setItem("pageReloaded", "true");
    setIsLoggedIn(false);
    console.log(
      "handleLogout - pageReloaded:",
      localStorage.getItem("pageReloaded")
    );
  };

  const handleLogin = () => {
    window.location.reload(true);
    localStorage.setItem("pageReloaded", "false");
    console.log(
      "handleLogin - pageReloaded:",
      localStorage.getItem("pageReloaded")
    );
  };

  const handleCloseTuto = () => {
    localStorage.setItem("showTutoSlider", "false");
    setShowTutoSlider(false);
  };

  useEffect(() => {
    const storedPageReloaded = localStorage.getItem("pageReloaded");
    setIsLoggedIn(storedPageReloaded === "false" || false);
  }, [localStorage.getItem("pageReloaded")]);

  useEffect(() => {
    const storedShowTutoSlider = localStorage.getItem("showTutoSlider");

    if (storedShowTutoSlider === null) {
      localStorage.setItem("showTutoSlider", "true");
    } else {
      setShowTutoSlider(storedShowTutoSlider === "true");
    }
  }, []);

  const { userData } = useAuth();

  useRedirectionIfNecessary(userData);

  if (!userData && isLoggedIn && !isDesktop) {
    return <PleaseLogin />;
  }

  if (!userData && !isLoggedIn && !isDesktop) {
    return <SplashScreen onLogin={handleLogin} />;
  }

  if (isDesktop) {
    return <PleaseMobile />;
  }

  return (
    <BrowserRouter>
      {showTutoSlider && <TutoSlider handleClose={handleCloseTuto} />}

      {isLoggedIn && (
        <>
          <RoutesPaths onLogout={handleLogout} />
          <Navbar onLogout={handleLogout} />
        </>
      )}
    </BrowserRouter>
  );
}

const AppWithAuthProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuthProvider;
