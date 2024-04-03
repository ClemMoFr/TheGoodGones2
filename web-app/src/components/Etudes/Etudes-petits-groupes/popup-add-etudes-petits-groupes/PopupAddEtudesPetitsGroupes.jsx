import React, { useState } from "react";
import "./PopupAddEtudesPetitsGroupes.css";
import BackArrow from "../../../back-arrow/BackArrow";

const PopupAddEtudesPetitsGroupes = ({
  valueEtudePetitsGroupesTitle,
  onChangeValueEtudePetitsGroupesTitle,
  addEtudePetitGroupe,
  backArrowFunction,
}) => {
  const [questionCount, setQuestionCount] = useState(1);
  const [questionInputs, setQuestionInputs] = useState([]);
  const [etudeDescription, setEtudeDescription] = useState("");
  const [nextId, setNextId] = useState(1);

  const addQuestion = () => {
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    setQuestionInputs([...questionInputs, ``]);
  };

  const removeQuestion = () => {
    if (questionCount > 1) {
      const newQuestionCount = questionCount - 1;
      setQuestionCount(newQuestionCount);
      setQuestionInputs(questionInputs.slice(0, -1));
    }
  };

  const handleAddEtudePetitsGroupes = () => {
    const nouvelleEtudePetitsGroupes = {
      etudePetitsGroupesTitle: valueEtudePetitsGroupesTitle,
      etudePetitsGroupesDescription: etudeDescription,
      questions: questionInputs,
    };

    addEtudePetitGroupe(nouvelleEtudePetitsGroupes);
  };

  return (
    <form
      className="popupAddEtudesPetitsGroupesMainContainer"
      onSubmit={handleAddEtudePetitsGroupes}
    >
      <div className="popupAddEtudesPetitsGroupes">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
          }}
        >
          <p className="popupAddTitleJeune">
            Ajouter une étude <br />
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
              value={valueEtudePetitsGroupesTitle}
              onChange={onChangeValueEtudePetitsGroupesTitle}
            ></input>
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Description de l'étude
            <input
              style={{ width: "100%", marginTop: "10px" }}
              value={etudeDescription}
              onChange={(e) => setEtudeDescription(e.target.value)}
            ></input>
          </label>
        </div>
        <div className="popupAddEtudesPetitsGroupesQuestionContainer">
          {questionInputs.map((question, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <label>
                {`Question ${index + 1}`}
                <input
                  style={{ width: "100%", marginTop: "10px" }}
                  value={question}
                  placeholder="Saisissez votre question"
                  onChange={(e) => {
                    const updatedQuestions = [...questionInputs];
                    updatedQuestions[index] = e.target.value;
                    setQuestionInputs(updatedQuestions);
                  }}
                ></input>
              </label>
            </div>
          ))}
        </div>
        <div className="btnAddAndRemoveQuestionContainer">
          <div className="btnAddQuestion" onClick={addQuestion}>
            +
          </div>
          {questionCount > 1 && (
            <div className="btnAddQuestion" onClick={removeQuestion}>
              -
            </div>
          )}
        </div>
        <button type="submit">Ajouter</button>
      </div>
    </form>
  );
};

export default PopupAddEtudesPetitsGroupes;
