import React, { useState, useEffect } from "react";
import "./PopupDetailsEtudesPetitsGroupes.css";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupDetailsEtudesPetitsGroupes = ({
  etudeTitle,
  etudeDescription,
  questions,
  userData,
  updateStatus,
  status,
  backArrowFunction,
}) => {
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [oldAnswer, setOldAnswer] = useState("");

  useEffect(() => {
    const existingAnswers = JSON.parse(localStorage.getItem("answers")) || [];
    const match = existingAnswers.find((ans) =>
      ans.includes(`${etudeTitle}, ${currentQuestion}:`)
    );
    setOldAnswer(match ? match.split(":")[1].trim() : "");
    setAnswer(match ? match.split(":")[1].trim() : "");
  }, [currentQuestion, etudeTitle]);

  const phrasesSansReponse = [
    "Oops ! Il semble que tes réponses aient pris des vacances spirituelles. 🌴",
    "Jésus sait toujours ce qui se cache même quand tu ne réussis pas à le formuler. 🕵️‍♂️",
    "Quand les réponses disparaissent, Dieu continue de tendre la main. ✋",
    "Aucune réponse ? Pas de problème, Dieu écrit toujours droit avec des lignes courbes. 📝",
    "Le Saint-Esprit, le maître de la restauration des réponses perdues. 🛠️",
    "Jésus, la clé USB céleste pour sauvegarder nos pensées. 💾",
    "Dieu lit entre les lignes même quand les lignes sont vides. 📖",
    "Le Saint-Esprit, l'expert en récupération des réponses effacées. 🔄",
    "Aucune réponse, mais Jésus sait comment remplir les blancs. ⚪",
    "Dieu, le rédacteur en chef de notre histoire, même sans réponses. 📜",
    "Le Saint-Esprit, le détective divin qui cherche nos pensées disparues. 🔍",
    "Oops ! C'est comme si tu avais effacé un post-it dans le livre de Dieu. 📔",
    "Jésus, le GPS spirituel même quand les réponses font des détours. 📍",
    "Dieu, le restaurateur divin des réponses manquantes. 🎨",
    "Le Saint-Esprit, le professeur qui enseigne même dans le silence. 📚",
    "Aucune réponse, mais Dieu continue de tisser sa toile d'amour. 🕸️",
    "Oops ! Quand les réponses s'envolent, Jésus les gardent dans les nuages. ⛅",
    "Dieu, le créateur qui ne craint pas les pages blanches de nos vies. 🌈",
    "Le Saint-Esprit, le scripteur céleste qui connaît la fin de chaque réponse. 🎬",
    "Aucune réponse ? Jésus est toujours le mot final. Amen. 🙏",
    "Le Sai nt-Esprit danse même sur les pages blanches de nos réponses ! 💃",
    "Dieu n'est jamais loin : cherchez et vous trouverez, frappez et l'on vous ouvrira ! 🚪",
  ];

  const handleAddNotes = (question) => {
    setCurrentQuestion(question);
    setShowNotePopup(true);
    setIsEditing(false);
  };

  const handleEditAnswer = (question) => {
    setCurrentQuestion(question);
    setShowNotePopup(true);
    setIsEditing(true);
  };

  const handleValidateAnswer = () => {
    const studyName = etudeTitle;
    const questionName = currentQuestion;
    const existingAnswers = JSON.parse(localStorage.getItem("answers")) || [];
    const randomIndex = Math.floor(Math.random() * phrasesSansReponse.length);
    const newAnswer = `${studyName}, ${questionName}: ${
      answer.trim() || phrasesSansReponse[randomIndex]
    }`;

    if (isEditing) {
      const updatedAnswers = existingAnswers.map((ans) =>
        ans.includes(`${studyName}, ${questionName}:`)
          ? `${studyName}, ${questionName}: ${
              answer.trim() || phrasesSansReponse[randomIndex]
            }`
          : ans
      );
      localStorage.setItem("answers", JSON.stringify(updatedAnswers));
    } else {
      const updatedAnswers = [...existingAnswers, newAnswer];
      localStorage.setItem("answers", JSON.stringify(updatedAnswers));
    }

    setShowNotePopup(false);
    setCurrentQuestion("");
    setOldAnswer("");
    setAnswer("");
    setIsEditing(false);
  };

  return (
    <>
      {showNotePopup ? (
        <div className="notePopupMainContainer">
          <div className="notePopupContainer">
            <h2>{isEditing ? "Modifier la note" : "Ajouter une note"}</h2>
            <p>Question : {currentQuestion}</p>
            <div>
              <p>Réponse :</p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <button onClick={handleValidateAnswer}>
              {isEditing ? "Valider la modification" : "Valider"}
            </button>
          </div>
        </div>
      ) : (
        <div className="popupDetailsEtudesPetitsGroupesMainContainer">
          <BackArrow
            arrowPosition={"absolute"}
            xPosition={"30px"}
            yPosition={"-10px"}
            icon={"arrow"}
            backArrowFunction={backArrowFunction}
          />
          {userData &&
            userData.additionalInfo &&
            (userData.additionalInfo.status === "monos" ||
              userData.additionalInfo.status === "admin") && (
              <>
                {status ? (
                  <p style={{ color: "#C6253D", marginTop: "15px" }}>
                    L'inscription à déjà été envoyée !
                  </p>
                ) : (
                  <button
                    className="sendEtudeNotification"
                    onClick={updateStatus}
                  >
                    Envoyer l'inscription
                  </button>
                )}
              </>
            )}
          <p className="popupDetailsTitle">{etudeTitle}</p>
          <p>{etudeDescription}</p>
          <div className="popupDetailsQuestionsContainer">
            {questions.map((question, index) => {
              const existingAnswers =
                JSON.parse(localStorage.getItem("answers")) || [];
              const matchingAnswer = existingAnswers.find((ans) =>
                ans.includes(`${etudeTitle}, ${question}:`)
              );

              return (
                <div key={index}>
                  <p>
                    <span>{`Q${index + 1}.`}</span> {question}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: matchingAnswer
                          ? "flex-start"
                          : "center",
                        borderRadius: "20px",
                        backgroundColor: "#FFF",
                        boxShadow: "0px 0px 30px 0px rgba(203, 228, 255, 0.60)",
                        width: "95%",
                        margin: "30px auto 20px",
                        minHeight: "80px",
                        padding: "20px",
                        position: "relative",
                      }}
                    >
                      {matchingAnswer && (
                        <p
                          style={{
                            position: "absolute",
                            top: "-30px",
                            right: "20px",
                            cursor: "pointer",
                            color: "#C6253D",
                          }}
                          onClick={() => handleEditAnswer(question)}
                        >
                          Modifier
                        </p>
                      )}

                      {matchingAnswer ? (
                        <p>{matchingAnswer.split(":")[1].trim()}</p>
                      ) : (
                        <button
                          style={{
                            borderRadius: "20px",
                            backgroundColor: "#C6253D",
                            padding: "10px",
                            margin: "20px auto",
                            border: "none",
                            fontWeight: "bold",
                            color: "white",
                          }}
                          onClick={() => handleAddNotes(question)}
                        >
                          Ajouter des notes
                        </button>
                      )}
                    </div>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupDetailsEtudesPetitsGroupes;
