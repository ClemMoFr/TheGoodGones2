import React from "react";

const PleaseMobile = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: "0",
        left: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ marginBottom: "30px", fontSize: "3rem", fontWeight: "800" }}>
        Ooops !
      </p>
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "500",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        Il semblerait que tu utilises un ordinateur, l'application est
        disponible uniquement sur mobile !
      </p>
    </div>
  );
};

export default PleaseMobile;
