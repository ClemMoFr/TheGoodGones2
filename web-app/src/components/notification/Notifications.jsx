import React, { useEffect, useState } from "react";
import "./Notifications.css";
import SpinnerComponent from "../Spinner-composant/SpinnerComponent";

const Notifications = () => {
  const [emailsToSend, setEmailsToSend] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendEmails = async () => {
    setLoading(true);
    try {
      const emailAddresses = emailsToSend;

      if (emailAddresses && emailAddresses.length > 0) {
        const response = await fetch(
          "http://localhost:4000/send-notifications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ emailAddresses, notificationData }),
          }
        );

        if (response.ok) {
          console.log("E-mails envoyés avec succès!");
          window.location.reload(true);
        } else {
          console.error("Erreur lors de l'envoi des e-mails");
        }
      } else {
        console.warn("Aucune adresse e-mail à envoyer");
      }
    } catch (error) {
      console.error("Une erreur s'est produite", error);
    }
  };

  useEffect(() => {
    const getJeunesAdresses = JSON.parse(localStorage.getItem("jeunes")) || [];
    const jeunesEmails = getJeunesAdresses.map((jeune) => jeune.jeuneMail);

    const getMonosAdresses = JSON.parse(localStorage.getItem("monos")) || [];
    const monosEmails = getMonosAdresses.map((mono) => mono.monoMail);

    const getAdminAdresses =
      JSON.parse(localStorage.getItem("currentUser")) || [];
    const adminEmail = getAdminAdresses.email;

    const updatedEmailsToSend = [...jeunesEmails, ...monosEmails, adminEmail];
    setEmailsToSend(updatedEmailsToSend);
  }, []);

  const [notificationData, setNotificationData] = useState({
    notificationTitle: "",
    notificationContent: "",
  });

  const handleInputChange = (key, value) => {
    setNotificationData({
      ...notificationData,
      [key]: value,
    });
  };

  return (
    <div className="notificationMainContainer">
      <form>
        <p>Envoyer une notification</p>
        <label>
          titre de la notification
          <input
            value={notificationData.notificationTitle}
            onChange={(e) =>
              handleInputChange("notificationTitle", e.target.value)
            }
          ></input>
        </label>
        <label>
          contenu de la notification
          <textarea
            value={notificationData.notificationContent}
            onChange={(e) =>
              handleInputChange("notificationContent", e.target.value)
            }
          ></textarea>
        </label>
        <button type="button" onClick={sendEmails}>
          {loading ? <SpinnerComponent /> : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default Notifications;
