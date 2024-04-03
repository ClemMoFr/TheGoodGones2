import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import "./Epevc.css";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BiSolidChevronLeft } from "react-icons/bi";
import { PiPiggyBankFill } from "react-icons/pi";
import BackArrow from "../../../components/back-arrow/BackArrow";

const Epevc = () => {
  const { database } = FirebaseConfig();

  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [budgetEpevc, setBudgetEpevc] = useState([]);
  const [budgetEpevcLibelle, setBudgetEpevcLibelle] = useState("");
  const [budgetEpevcType, setBudgetEpevcType] = useState("dépense");
  const [budgetEpevcMontant, setBudgetEpevcMontant] = useState("");
  const [popupBudgetAnnuelEpevc, setPopupBudgetAnnuelEpevc] = useState(false);
  const [popupModifyBudget, setPopupModifyBudget] = useState(false);
  const [budgetAnnuelEpevc, setBudgetAnnuelEpevc] = useState("0");
  const [budgetIdToEdit, setBudgetIdToEdit] = useState(null);
  const [budgetEpevcNewLibelle, setBudgetEpevcNewLibelle] = useState("");
  const [budgetEpevcNewType, setBudgetEpevcNewType] = useState("dépense");
  const [budgetEpevcNewMontant, setBudgetEpevcNewMontant] = useState("");
  const [totalBudgetEpevcMontant, setTotalBudgetEpevcMontant] = useState(0);

  useEffect(() => {
    const dataRef = ref(database, `budgets/budgetEpevc/depenses`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setBudgetEpevc(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setBudgetEpevc([]);
      }
    });
    return () => unsubscribe();
  }, [database]);

  useEffect(() => {
    const dataRef = ref(database, `budgets/budgetEpevc/budgetAnnuel`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        if (retrievedData && retrievedData.budgetAnnuelEpevc) {
          setBudgetAnnuelEpevc(retrievedData.budgetAnnuelEpevc);
        } else {
          console.log(
            "La propriété budgetAnnuelEpevc n'existe pas dans les données récupérées."
          );
          setBudgetAnnuelEpevc("0");
        }
      } else {
        console.log("Aucune donnée trouvée.");
        setBudgetAnnuelEpevc("0");
      }
    });
    return () => unsubscribe();
  }, [database]);

  function toggleSlideCTA(index) {
    setActiveSlideIndex(index === activeSlideIndex ? null : index);
  }

  const addBudgetAnnuelEpevc = (e) => {
    set(ref(database, `budgets/budgetEpevc/budgetAnnuel`), {
      budgetAnnuelEpevc: budgetAnnuelEpevc,
    });

    e.preventDefault();

    setBudgetAnnuelEpevc(budgetAnnuelEpevc);
    window.location.reload(true);
  };

  const addCostEpevc = (e) => {
    e.preventDefault();
    const depenseId = uuidv4();
    const nouveauxBudgetEpevc = {
      id: depenseId,
      budgetEpevcLibelle: budgetEpevcLibelle,
      budgetEpevcType: budgetEpevcType,
      budgetEpevcMontant: budgetEpevcMontant,
    };

    const budgetEpevcRef = ref(
      database,
      `budgets/budgetEpevc/depenses/${depenseId}`
    );

    set(budgetEpevcRef, nouveauxBudgetEpevc)
      .then(() => {
        console.log("Ajout réussi !");

        const updatedBudgetEpevc = [...budgetEpevc, nouveauxBudgetEpevc];
        setBudgetEpevc(updatedBudgetEpevc);

        setBudgetEpevcLibelle("");
        setBudgetEpevcType("dépense");
        setBudgetEpevcMontant("");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error.message);
      });
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await calculateBalance();
      setTotalBudgetEpevcMontant(balance);
    };

    fetchBalance();
  }, [budgetAnnuelEpevc, budgetEpevc]);

  const calculateBalance = async () => {
    try {
      const budgetAnnuelEpevcRef = ref(
        database,
        `budgets/budgetEpevc/budgetAnnuel`
      );
      const annualBudgetSnapshot = await get(budgetAnnuelEpevcRef);
      const annualBudget = annualBudgetSnapshot.val()?.budgetAnnuelEpevc || 0;

      const depensesRef = ref(database, `budgets/budgetEpevc/depenses`);
      const depensesSnapshot = await get(depensesRef);
      const depensesData = depensesSnapshot.val() || {};

      const totalExpenses = Object.values(depensesData).reduce(
        (total, item) => {
          const montant = parseFloat(item.budgetEpevcMontant);
          return item.budgetEpevcType === "gain"
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

  const remainingExpense = parseFloat(totalBudgetEpevcMontant);

  const statusBar = (remainingExpense / budgetAnnuelEpevc) * 100;

  const updateBudgetEpevc = (e) => {
    e.preventDefault();

    const updatedBudgetEpevc = {
      budgetEpevcLibelle: budgetEpevcNewLibelle,
      budgetEpevcType: budgetEpevcNewType,
      budgetEpevcMontant: budgetEpevcNewMontant,
    };

    const budgetEpevcRef = ref(
      database,
      `budgets/budgetEpevc/depenses/${budgetIdToEdit}`
    );

    update(budgetEpevcRef, updatedBudgetEpevc)
      .then(() => {
        console.log("Mise à jour réussie !");
        setPopupModifyBudget(false);
        setBudgetIdToEdit(null);
        setBudgetEpevcNewLibelle("");
        setBudgetEpevcNewType("dépense");
        setBudgetEpevcNewMontant("");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error.message);
      });
  };

  const editBudget = (depense) => {
    setPopupModifyBudget(true);
    setBudgetEpevcNewLibelle(depense.budgetEpevcLibelle);
    setBudgetEpevcNewType(depense.budgetEpevcType);
    setBudgetEpevcNewMontant(depense.budgetEpevcMontant);
    setBudgetIdToEdit(depense.id);
  };

  const [messageDelete, setMessageDelete] = useState(false);

  const deleteEpevcBudget = (id) => {
    const budgetEpevcRef = ref(database, `budgets/budgetEpevc/depenses/${id}`);
    remove(budgetEpevcRef)
      .then(() => {
        console.log("Successfully deleted from Firebase!");
        const updatedBudgetEpevc = budgetEpevc.filter(
          (budget) => budget.id !== id
        );
        setBudgetEpevc(updatedBudgetEpevc);
        setMessageDelete(false);
      })
      .catch((error) => {
        console.error("Error deleting from Firebase:", error.message);
      });
  };

  return (
    <div className="epevcMainContainer">
      {popupBudgetAnnuelEpevc && (
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
              backArrowFunction={() => setPopupBudgetAnnuelEpevc(false)}
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
              value={budgetAnnuelEpevc}
              onChange={(e) => setBudgetAnnuelEpevc(e.target.value)}
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
              onClick={addBudgetAnnuelEpevc}
            >
              Ajouter / Modifier
            </button>
          </div>
        </div>
      )}
      <div className="epevcTop">
        <div className="epevcTopIcon"></div>
        <p className="epevcTopTitle">epevc</p>
        <div className="epevcBlockPrice">
          <p>il reste</p>
          <p>
            {remainingExpense || 0} € / {statusBar ? statusBar.toFixed(1) : 0}%
          </p>
          <div
            className="epevcPriceSliderContainer"
            style={{ overflow: "hidden" }}
          >
            <div
              className="epevcPriceSlider"
              style={{ width: `${statusBar}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="epevcBottom">
        <p
          style={{
            margin: "10px 20px 10px auto",
            color: "#c6253d",
            fontWeight: 600,
          }}
          onClick={() => setPopupBudgetAnnuelEpevc(true)}
        >
          Modifier le budget annuel
        </p>
        <div className="epevcBudgetYearlyCard">
          <p>{budgetAnnuelEpevc.budgetAnnuelEpevc || budgetAnnuelEpevc} €</p>
          <p>Budget annuel</p>
        </div>
        {popupModifyBudget ? (
          <form className="epevcAddCosts" onSubmit={updateBudgetEpevc}>
            <p>Modifier une dépense</p>
            <div className="epevcLine">
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
                  value={budgetEpevcNewLibelle}
                  onChange={(e) => setBudgetEpevcNewLibelle(e.target.value)}
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
                  value={budgetEpevcNewMontant}
                  onChange={(e) => setBudgetEpevcNewMontant(e.target.value)}
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
                  value={budgetEpevcNewType}
                  onChange={(e) => setBudgetEpevcNewType(e.target.value)}
                >
                  <option>dépense</option>
                  <option>gain</option>
                </select>
              </label>
            </div>
            <button type="onSubmit">Modifier</button>
          </form>
        ) : (
          <form className="epevcAddCosts" onSubmit={addCostEpevc}>
            <p>Ajouter une dépense</p>
            <div className="epevcLine">
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
                  value={budgetEpevcLibelle}
                  onChange={(e) => setBudgetEpevcLibelle(e.target.value)}
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
                  value={budgetEpevcMontant}
                  onChange={(e) => setBudgetEpevcMontant(e.target.value)}
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
                  value={budgetEpevcType}
                  onChange={(e) => setBudgetEpevcType(e.target.value)}
                >
                  <option>dépense</option>
                  <option>gain</option>
                </select>
              </label>
            </div>
            <button type="submit">Ajouter</button>
          </form>
        )}

        <div className="epevcGeneralesCardContainer">
          {budgetEpevc.map((depense, index) => (
            <div
              key={depense.id}
              className={`epevcGeneralesCardMainContainer ${
                index === activeSlideIndex ? "positionCenter" : "positionLeft"
              }`}
            >
              <div className="epevcGeneralesCard">
                <div className="epevcGeneralesNameAndArrow">
                  <PiPiggyBankFill size={30} />
                  <div
                    className={`epevcGeneralesArrows ${
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
                  {depense.budgetEpevcLibelle} -{" "}
                  <span
                    style={{
                      color:
                        depense.budgetEpevcType === "gain" ? "green" : "red",
                    }}
                  >
                    {depense.budgetEpevcMontant} €
                  </span>
                </p>
              </div>

              <div className="epevcGeneralesCardContainerCTA">
                <FaEdit
                  style={{ backgroundColor: "#4E77FF" }}
                  className="epevcGeneralesCTA"
                  onClick={() => editBudget(depense)}
                />
                <FaTrashCan
                  style={{ backgroundColor: "#F4244E" }}
                  className="epevcGeneralesCTA"
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
              Confirmez la suppression de "{messageDelete.budgetEpevcLibelle}" ?
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
                onClick={() => deleteEpevcBudget(messageDelete.id)}
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

export default Epevc;
