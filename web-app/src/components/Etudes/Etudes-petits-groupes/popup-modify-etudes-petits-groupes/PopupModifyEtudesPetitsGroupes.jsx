import React, { useState, useEffect } from "react";

import "./PopupModifyEtudesPetitsGroupes.css";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupModifyEtudesPetitsGroupes = ({
  selectedEtude,
  updateEtudePetitsGroupes,
  closePopup,
  backArrowFunction,
}) => {
  const [etudePetitsGroupesTitle, setEtudePetitsGroupesTitle] = useState(
    selectedEtude.etudePetitsGroupesTitle
  );
  const [etudePetitsGroupesDescription, setEtudePetitsGroupesDescription] =
    useState(selectedEtude.etudePetitsGroupesDescription);
  const [questions, setQuestions] = useState(selectedEtude.questions);

  const addQuestion = () => {
    const newQuestion = ``;
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = () => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.pop();
      setQuestions(newQuestions);
    }
  };

  const handleSaveChanges = () => {
    const updatedEtudePetitsGroupes = {
      id: selectedEtude.id,
      etudePetitsGroupesTitle,
      etudePetitsGroupesDescription,
      questions,
    };

    updateEtudePetitsGroupes(updatedEtudePetitsGroupes);
    closePopup();
  };

  return (
    <form className="popupModifyEtudesPetitsGroupesMainContainer">
      <div className="popupModifyEtudesPetitsGroupes">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
          }}
        >
          <p className="popupAddTitleJeune">
            Modifier une étude <br />
            petit groupe
          </p>
          <BackArrow
            backArrowFunction={backArrowFunction}
            arrowPosition={"absolute"}
            xPosition={"0px"}
            yPosition={"0px"}
            icon={"arrow"}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Titre de l'étude
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={etudePetitsGroupesTitle}
              onChange={(e) => setEtudePetitsGroupesTitle(e.target.value)}
            ></input>
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Description de l'étude
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={etudePetitsGroupesDescription}
              onChange={(e) => setEtudePetitsGroupesDescription(e.target.value)}
            ></input>
          </label>
        </div>
        <div className="popupModifyEtudesPetitsGroupesQuestionContainer">
          {questions.map((question, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <label>
                {`Question ${index + 1}`}
                <input
                  style={{ width: "100%", marginTop: "10px" }}
                  placeholder="Saisissez votre question"
                  value={question}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index] = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                ></input>
              </label>
            </div>
          ))}
        </div>
        <div className="btnModifyAndRemoveQuestionContainer">
          <div className="btnModifyQuestion" onClick={addQuestion}>
            +
          </div>
          {questions.length > 1 && (
            <div className="btnModifyQuestion" onClick={removeQuestion}>
              -
            </div>
          )}
        </div>
        <button onClick={handleSaveChanges}>
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
};

export default PopupModifyEtudesPetitsGroupes;
