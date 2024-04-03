import React, { useState, useEffect } from "react";
import { BsArrowsFullscreen } from "react-icons/bs";

const ReloadIndicator = () => {
  const [pageReloaded, setPageReloaded] = useState(false);

  useEffect(() => {
    const handlePageReload = () => {
      setPageReloaded(true);
      localStorage.setItem("pageReloaded", "true");
    };

    const handleExitFullscreen = () => {
      setPageReloaded(false);
      localStorage.setItem("pageReloaded", "false");
    };

    window.addEventListener("beforeunload", handlePageReload);
    document.addEventListener("fullscreenchange", handleExitFullscreen);

    const isPageReloaded = localStorage.getItem("pageReloaded") === "true";
    setPageReloaded(isPageReloaded);

    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
      document.removeEventListener("fullscreenchange", handleExitFullscreen);
    };
  }, []);

  const handleClose = () => {
    setPageReloaded(false);
    localStorage.setItem("pageReloaded", "false");
  };

  const elem = document.documentElement;

  function activerModePleinEcranWidget() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    handleClose();
  }

  return (
    <div>
      {pageReloaded && (
        <div
          style={{
            position: "absolute",
            right: "60px",
            bottom: "40%",
            backgroundColor: "red",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              borderRadius: "30px",
              position: "absolute",
              boxShadow: "0px 0px 30px 0px rgba(203, 228, 255, 1)",
            }}
          >
            <BsArrowsFullscreen onClick={activerModePleinEcranWidget} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReloadIndicator;
