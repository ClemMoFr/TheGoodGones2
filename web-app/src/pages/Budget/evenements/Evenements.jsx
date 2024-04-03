import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import "./Evenements.css";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BiSolidChevronLeft } from "react-icons/bi";
import { PiPiggyBankFill } from "react-icons/pi";
import BackArrow from "../../../components/back-arrow/BackArrow";

const Evenements = () => {
  const { database } = FirebaseConfig();

  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [budgetEvenements, setBudgetEvenements] = useState([]);
  const [budgetEvenementsLibelle, setBudgetEvenementsLibelle] = useState("");
  const [budgetEvenementsType, setBudgetEvenementsType] = useState("dépense");
  const [budgetEvenementsMontant, setBudgetEvenementsMontant] = useState("");
  const [popupBudgetAnnuelEvenements, setPopupBudgetAnnuelEvenements] =
    useState(false);
  const [popupModifyBudget, setPopupModifyBudget] = useState(false);
  const [budgetAnnuelEvenements, setBudgetAnnuelEvenements] = useState("0");
  const [budgetIdToEdit, setBudgetIdToEdit] = useState(null);
  const [budgetEvenementsNewLibelle, setBudgetEvenementsNewLibelle] =
    useState("");
  const [budgetEvenementsNewType, setBudgetEvenementsNewType] =
    useState("dépense");
  const [budgetEvenementsNewMontant, setBudgetEvenementsNewMontant] =
    useState("");
  const [totalBudgetEvenementsMontant, setTotalBudgetEvenementsMontant] =
    useState(0);

  useEffect(() => {
    const dataRef = ref(database, `budgets/budgetEvenements/depenses`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setBudgetEvenements(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setBudgetEvenements([]);
      }
    });
    return () => unsubscribe();
  }, [database]);

  useEffect(() => {
    const dataRef = ref(database, `budgets/budgetEvenements/budgetAnnuel`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        if (retrievedData && retrievedData.budgetAnnuelEvenements) {
          setBudgetAnnuelEvenements(retrievedData.budgetAnnuelEvenements);
        } else {
          console.log(
            "La propriété budgetAnnuelEvenements n'existe pas dans les données récupérées."
          );
          setBudgetAnnuelEvenements("0");
        }
      } else {
        console.log("Aucune donnée trouvée.");
        setBudgetAnnuelEvenements("0");
      }
    });
    return () => unsubscribe();
  }, [database]);

  function toggleSlideCTA(index) {
    setActiveSlideIndex(index === activeSlideIndex ? null : index);
  }

  const addBudgetAnnuelEvenements = (e) => {
    set(ref(database, `budgets/budgetEvenements/budgetAnnuel`), {
      budgetAnnuelEvenements: budgetAnnuelEvenements,
    });

    e.preventDefault();

    setBudgetAnnuelEvenements(budgetAnnuelEvenements);
    window.location.reload(true);
  };

  const addCostEvenements = (e) => {
    e.preventDefault();
    const depenseId = uuidv4();
    const nouveauxBudgetEvenements = {
      id: depenseId,
      budgetEvenementsLibelle: budgetEvenementsLibelle,
      budgetEvenementsType: budgetEvenementsType,
      budgetEvenementsMontant: budgetEvenementsMontant,
    };

    const budgetEvenementsRef = ref(
      database,
      `budgets/budgetEvenements/depenses/${depenseId}`
    );

    set(budgetEvenementsRef, nouveauxBudgetEvenements)
      .then(() => {
        console.log("Ajout réussi !");
        const updatedBudgetEvenements = [
          ...budgetEvenements,
          nouveauxBudgetEvenements,
        ];
        setBudgetEvenements(updatedBudgetEvenements);
        setBudgetEvenementsLibelle("");
        setBudgetEvenementsType("dépense");
        setBudgetEvenementsMontant("");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error.message);
      });
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await calculateBalance();
      setTotalBudgetEvenementsMontant(balance);
    };

    fetchBalance();
  }, [budgetAnnuelEvenements, budgetEvenements]);

  const calculateBalance = async () => {
    try {
      const budgetAnnuelEvenementsRef = ref(
        database,
        `budgets/budgetEvenements/budgetAnnuel`
      );
      const annualBudgetSnapshot = await get(budgetAnnuelEvenementsRef);
      const annualBudget =
        annualBudgetSnapshot.val()?.budgetAnnuelEvenements || 0;

      const depensesRef = ref(database, `budgets/budgetEvenements/depenses`);
      const depensesSnapshot = await get(depensesRef);
      const depensesData = depensesSnapshot.val() || {};

      const totalExpenses = Object.values(depensesData).reduce(
        (total, item) => {
          const montant = parseFloat(item.budgetEvenementsMontant);
          return item.budgetEvenementsType === "gain"
            ? total - montant
            : total + montant;
        },
        0
      );

      const balance = parseFloat(annualBudget) - totalExpenses;

      return balance;
    } catch (error) {
      console.error("Error fetching data from Firebase:", error.message);
      return 0;
    }
  };

  const remainingExpense = parseFloat(totalBudgetEvenementsMontant);

  const statusBar = (remainingExpense / budgetAnnuelEvenements) * 100;

  const updateBudgetEvenements = (e) => {
    e.preventDefault();

    const updatedBudgetEvenements = {
      budgetEvenementsLibelle: budgetEvenementsNewLibelle,
      budgetEvenementsType: budgetEvenementsNewType,
      budgetEvenementsMontant: budgetEvenementsNewMontant,
    };

    const budgetEvenementsRef = ref(
      database,
      `budgets/budgetEvenements/depenses/${budgetIdToEdit}`
    );

    update(budgetEvenementsRef, updatedBudgetEvenements)
      .then(() => {
        console.log("Mise à jour réussie !");
        setPopupModifyBudget(false);
        setBudgetIdToEdit(null);
        setBudgetEvenementsNewLibelle("");
        setBudgetEvenementsNewType("dépense");
        setBudgetEvenementsNewMontant("");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error.message);
      });
  };

  const editBudget = (depense) => {
    setPopupModifyBudget(true);
    setBudgetEvenementsNewLibelle(depense.budgetEvenementsLibelle);
    setBudgetEvenementsNewType(depense.budgetEvenementsType);
    setBudgetEvenementsNewMontant(depense.budgetEvenementsMontant);
    setBudgetIdToEdit(depense.id);
  };

  const [messageDelete, setMessageDelete] = useState(false);

  const deleteEvenementsBudget = (id) => {
    const budgetEvenementsRef = ref(
      database,
      `budgets/budgetEvenements/depenses/${id}`
    );
    remove(budgetEvenementsRef)
      .then(() => {
        console.log("Successfully deleted from Firebase!");
        const updatedBudgetEvenements = budgetEvenements.filter(
          (budget) => budget.id !== id
        );
        setBudgetEvenements(updatedBudgetEvenements);
        setMessageDelete(false);
      })
      .catch((error) => {
        console.error("Error deleting from Firebase:", error.message);
      });
  };

  return (
    <div className="evenementsMainContainer">
      {popupBudgetAnnuelEvenements && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            top: "0",
            left: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(0,0,0,0.2)",
            zIndex: "10",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "white",
              padding: "20px",
              zIndex: "10",
              borderRadius: "20px",
              position: "relative",
            }}
          >
            <BackArrow
              backArrowFunction={() => setPopupBudgetAnnuelEvenements(false)}
              arrowPosition={"absolute"}
              xPosition={"15px"}
              yPosition={"15px"}
              icon={"cross"}
            />
            <p style={{ fontSize: "1.2rem" }}>Budget annuel</p>
            <input
              style={{
                margin: "10px 0px",
                height: "50px",
                width: "70%",
                backgroundColor: "rgb(231, 240, 255)",
                borderRadius: "30px",
                border: "none",
                textAlign: "center",
                color: "rgb(181, 214, 255)",
                fontSize: "1.2rem",
              }}
              value={budgetAnnuelEvenements}
              onChange={(e) => setBudgetAnnuelEvenements(e.target.value)}
            />
            <button
              style={{
                backgroundColor: "#c6253d",
                borderRadius: "30px",
                border: "none",
                textAlign: "center",
                color: "white",
                padding: "10px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={addBudgetAnnuelEvenements}
            >
              Ajouter / Modifier
            </button>
          </div>
        </div>
      )}
      <div className="evenementsTop">
        <div className="evenementsTopIcon"></div>
        <p className="evenementsTopTitle">Evenements</p>
        <div className="evenementsBlockPrice">
          <p>il reste</p>
          <p>
            {remainingExpense || 0} € / {statusBar ? statusBar.toFixed(1) : 0}%
          </p>
          <div
            className="evenementsPriceSliderContainer"
            style={{ overflow: "hidden" }}
          >
            <div
              className="evenementsPriceSlider"
              style={{ width: `${statusBar}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="evenementsBottom">
        <p
          style={{
            margin: "10px 20px 10px auto",
            color: "#c6253d",
            fontWeight: 600,
          }}
          onClick={() => setPopupBudgetAnnuelEvenements(true)}
        >
          Modifier le budget annuel
        </p>
        <div className="evenementsBudgetYearlyCard">
          <p>
            {budgetAnnuelEvenements.budgetAnnuelEvenements ||
              budgetAnnuelEvenements}{" "}
            €
          </p>
          <p>Budget annuel</p>
        </div>
        {popupModifyBudget ? (
          <form
            className="evenementsAddCosts"
            onSubmit={updateBudgetEvenements}
          >
            <p>Modifier une dépense</p>
            <div className="evenementsLine">
              <label style={{ width: "50%", marginRight: "10px" }}>
                libellé
                <input
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    height: "50px",
                    backgroundColor: "#e7f0ff",
                    border: "none",
                  }}
                  value={budgetEvenementsNewLibelle}
                  onChange={(e) =>
                    setBudgetEvenementsNewLibelle(e.target.value)
                  }
                />
              </label>
              <label style={{ width: "25%", marginRight: "10px" }}>
                montant
                <input
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    height: "50px",
                    backgroundColor: "#e7f0ff",
                    border: "none",
                  }}
                  value={budgetEvenementsNewMontant}
                  onChange={(e) =>
                    setBudgetEvenementsNewMontant(e.target.value)
                  }
                />
              </label>
              <label style={{ width: "25%" }}>
                type
                <select
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    height: "50px",
                    backgroundColor: "#e7f0ff",
                    border: "none",
                    color: "#B5D6FF",
                  }}
                  value={budgetEvenementsNewType}
                  onChange={(e) => setBudgetEvenementsNewType(e.target.value)}
                >
                  <option>dépense</option>
                  <option>gain</option>
                </select>
              </label>
            </div>
            <button type="onSubmit">Modifier</button>
          </form>
        ) : (
          <form className="evenementsAddCosts" onSubmit={addCostEvenements}>
            <p>Ajouter une dépense</p>
            <div className="evenementsLine">
              <label style={{ width: "50%", marginRight: "10px" }}>
                libellé
                <input
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    height: "50px",
                    backgroundColor: "#e7f0ff",
                    border: "none",
                  }}
                  value={budgetEvenementsLibelle}
                  onChange={(e) => setBudgetEvenementsLibelle(e.target.value)}
                />
              </label>
              <label style={{ width: "25%", marginRight: "10px" }}>
                montant
                <input
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    height: "50px",
                    backgroundColor: "#e7f0ff",
                    border: "none",
                  }}
                  value={budgetEvenementsMontant}
                  onChange={(e) => setBudgetEvenementsMontant(e.target.value)}
                />
              </label>
              <label style={{ width: "25%" }}>
                type
                <select
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    height: "50px",
                    backgroundColor: "#e7f0ff",
                    border: "none",
                    color: "#B5D6FF",
                  }}
                  value={budgetEvenementsType}
                  onChange={(e) => setBudgetEvenementsType(e.target.value)}
                >
                  <option>dépense</option>
                  <option>gain</option>
                </select>
              </label>
            </div>
            <button type="submit">Ajouter</button>
          </form>
        )}

        <div className="evenementsGeneralesCardContainer">
          {budgetEvenements.map((depense, index) => (
            <div
              key={depense.id}
              className={`evenementsGeneralesCardMainContainer ${
                index === activeSlideIndex ? "positionCenter" : "positionLeft"
              }`}
            >
              <div className="evenementsGeneralesCard">
                <div className="evenementsGeneralesNameAndArrow">
                  <PiPiggyBankFill size={30} />
                  <div
                    className={`evenementsGeneralesArrows ${
                      index === activeSlideIndex ? "arrowLeft" : ""
                    }`}
                    onClick={() => toggleSlideCTA(index)}
                  >
                    {[0, 1, 2, 3].map((item) => (
                      <BiSolidChevronLeft
                        key={item}
                        size={30}
                        style={{
                          position: "absolute",
                          right: `${item * 10}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    margin: "0px auto",
                    width: "80%",
                    textAlign: "center",
                    overflowX: "scroll",
                    whiteSpace: "nowrap",
                  }}
                >
                  {depense.budgetEvenementsLibelle} -{" "}
                  <span
                    style={{
                      color:
                        depense.budgetEvenementsType === "gain"
                          ? "green"
                          : "red",
                    }}
                  >
                    {depense.budgetEvenementsMontant} €
                  </span>
                </p>
              </div>

              <div className="evenementsGeneralesCardContainerCTA">
                <FaEdit
                  style={{ backgroundColor: "#4E77FF" }}
                  className="evenementsGeneralesCTA"
                  onClick={() => editBudget(depense)}
                />
                <FaTrashCan
                  style={{ backgroundColor: "#F4244E" }}
                  className="evenementsGeneralesCTA"
                  onClick={() => setMessageDelete(depense)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {messageDelete && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "2",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "90%",
              backgroundColor: "white",
              padding: " 30px",
              borderRadius: "30px",
            }}
          >
            <p>
              Confirmez la suppression de "
              {messageDelete.budgetEvenementsLibelle}" ?
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                fontSize: "1.4rem",
                marginTop: "30px",
              }}
            >
              <p
                onClick={() => deleteEvenementsBudget(messageDelete.id)}
                style={{
                  padding: "5px 20px",
                  backgroundColor: "#c6253d",
                  fontSize: "1.2rem",
                  color: "white",
                  borderRadius: "30px",
                  border: "3px solid #c6253d",
                }}
              >
                oui
              </p>
              <p
                onClick={() => setMessageDelete(false)}
                style={{
                  padding: "5px 20px",
                  backgroundColor: "white",
                  fontSize: "1.2rem",
                  color: "#c6253d",
                  borderRadius: "30px",
                  border: "3px solid #c6253d",
                }}
              >
                non
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evenements;
