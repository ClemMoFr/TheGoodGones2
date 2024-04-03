import React, { useEffect, useState } from "react";
import FirebaseConfig from "../../../firebase/FirebaseConfig";
import { ref, set, get, update, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import "./Actes29.css";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BiSolidChevronLeft } from "react-icons/bi";
import { PiPiggyBankFill } from "react-icons/pi";
import BackArrow from "../../../components/back-arrow/BackArrow";

const Actes29 = () => {
  const { database } = FirebaseConfig();

  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [budgetActes29, setBudgetActes29] = useState([]);
  const [budgetActes29Libelle, setBudgetActes29Libelle] = useState("");
  const [budgetActes29Type, setBudgetActes29Type] = useState("dépense");
  const [budgetActes29Montant, setBudgetActes29Montant] = useState("");
  const [popupBudgetAnnuelActes29, setPopupBudgetAnnuelActes29] =
    useState(false);
  const [popupModifyBudget, setPopupModifyBudget] = useState(false);
  const [budgetAnnuelActes29, setBudgetAnnuelActes29] = useState("0");
  const [budgetIdToEdit, setBudgetIdToEdit] = useState(null);
  const [budgetActes29NewLibelle, setBudgetActes29NewLibelle] = useState("");
  const [budgetActes29NewType, setBudgetActes29NewType] = useState("dépense");
  const [budgetActes29NewMontant, setBudgetActes29NewMontant] = useState("");
  const [totalBudgetActes29Montant, setTotalBudgetActes29Montant] = useState(0);

  useEffect(() => {
    const dataRef = ref(database, `budgets/budgetActes29/depenses`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        const dataArray = Object.values(retrievedData);
        setBudgetActes29(dataArray);
      } else {
        console.log("Aucune donnée trouvée.");
        setBudgetActes29([]);
      }
    });
    return () => unsubscribe();
  }, [database]);

  useEffect(() => {
    const dataRef = ref(database, `budgets/budgetActes29/budgetAnnuel`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const retrievedData = snapshot.val();
        if (retrievedData && retrievedData.budgetAnnuelActes29) {
          setBudgetAnnuelActes29(retrievedData.budgetAnnuelActes29);
        } else {
          console.log(
            "La propriété budgetAnnuelActes29 n'existe pas dans les données récupérées."
          );
          setBudgetAnnuelActes29("0");
        }
      } else {
        console.log("Aucune donnée trouvée.");
        setBudgetAnnuelActes29("0");
      }
    });
    return () => unsubscribe();
  }, [database]);

  function toggleSlideCTA(index) {
    setActiveSlideIndex(index === activeSlideIndex ? null : index);
  }

  const addBudgetAnnuelActes29 = (e) => {
    set(ref(database, `budgets/budgetActes29/budgetAnnuel`), {
      budgetAnnuelActes29: budgetAnnuelActes29,
    });

    e.preventDefault();

    setBudgetAnnuelActes29(budgetAnnuelActes29);
    window.location.reload(true);
  };

  const addCostActes29 = (e) => {
    e.preventDefault();
    const depenseId = uuidv4();
    const nouveauxBudgetActes29 = {
      id: depenseId,
      budgetActes29Libelle: budgetActes29Libelle,
      budgetActes29Type: budgetActes29Type,
      budgetActes29Montant: budgetActes29Montant,
    };

    const budgetActes29Ref = ref(
      database,
      `budgets/budgetActes29/depenses/${depenseId}`
    );

    set(budgetActes29Ref, nouveauxBudgetActes29)
      .then(() => {
        console.log("Ajout réussi !");
        const updatedBudgetActes29 = [...budgetActes29, nouveauxBudgetActes29];
        setBudgetActes29(updatedBudgetActes29);

        setBudgetActes29Libelle("");
        setBudgetActes29Type("dépense");
        setBudgetActes29Montant("");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error.message);
      });
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await calculateBalance();
      setTotalBudgetActes29Montant(balance);
    };

    fetchBalance();
  }, [budgetAnnuelActes29, budgetActes29]);

  const calculateBalance = async () => {
    try {
      const budgetAnnuelActes29Ref = ref(
        database,
        `budgets/budgetActes29/budgetAnnuel`
      );
      const annualBudgetSnapshot = await get(budgetAnnuelActes29Ref);
      const annualBudget = annualBudgetSnapshot.val()?.budgetAnnuelActes29 || 0;

      const depensesRef = ref(database, `budgets/budgetActes29/depenses`);
      const depensesSnapshot = await get(depensesRef);
      const depensesData = depensesSnapshot.val() || {};

      const totalExpenses = Object.values(depensesData).reduce(
        (total, item) => {
          const montant = parseFloat(item.budgetActes29Montant);
          return item.budgetActes29Type === "gain"
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

  const remainingExpense = parseFloat(totalBudgetActes29Montant);

  const statusBar = (remainingExpense / budgetAnnuelActes29) * 100;

  const updateBudgetActes29 = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();

      const updatedBudgetActes29 = {
        budgetActes29Libelle: budgetActes29NewLibelle,
        budgetActes29Type: budgetActes29NewType,
        budgetActes29Montant: budgetActes29NewMontant,
      };

      const budgetActes29Ref = ref(
        database,
        `budgets/budgetActes29/depenses/${budgetIdToEdit}`
      );

      update(budgetActes29Ref, updatedBudgetActes29)
        .then(() => {
          console.log("Mise à jour réussie !");
          setPopupModifyBudget(false);
          setBudgetIdToEdit(null);
          setBudgetActes29NewLibelle("");
          setBudgetActes29NewType("dépense");
          setBudgetActes29NewMontant("");
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour :", error.message);
        });
    } else {
      console.error("Invalid event object:", e);
    }
  };

  const editBudget = (depense) => {
    setPopupModifyBudget(true);
    setBudgetActes29NewLibelle(depense.budgetActes29Libelle);
    setBudgetActes29NewType(depense.budgetActes29Type);
    setBudgetActes29NewMontant(depense.budgetActes29Montant);
    setBudgetIdToEdit(depense.id);
  };

  const [messageDelete, setMessageDelete] = useState(false);

  const deleteActes29Budget = (id) => {
    const budgetActes29Ref = ref(
      database,
      `budgets/budgetActes29/depenses/${id}`
    );
    remove(budgetActes29Ref)
      .then(() => {
        console.log("Successfully deleted from Firebase!");
        const updatedBudgetActes29 = budgetActes29.filter(
          (budget) => budget.id !== id
        );
        setBudgetActes29(updatedBudgetActes29);
        setMessageDelete(false);
      })
      .catch((error) => {
        console.error("Error deleting from Firebase:", error.message);
      });
  };

  return (
    <div className="actes29MainContainer">
      {popupBudgetAnnuelActes29 && (
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
              backArrowFunction={() => setPopupBudgetAnnuelActes29(false)}
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
              value={budgetAnnuelActes29}
              onChange={(e) => setBudgetAnnuelActes29(e.target.value)}
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
              onClick={addBudgetAnnuelActes29}
            >
              Ajouter / Modifier
            </button>
          </div>
        </div>
      )}
      <div className="actes29Top">
        <div className="actes29TopIcon"></div>
        <p className="actes29TopTitle">Actes29</p>
        <div className="actes29BlockPrice">
          <p>il reste</p>
          <p>
            {remainingExpense || 0} € / {statusBar ? statusBar.toFixed(1) : 0}%
          </p>
          <div
            className="actes29PriceSliderContainer"
            style={{ overflow: "hidden" }}
          >
            <div
              className="actes29PriceSlider"
              style={{ width: `${statusBar}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="actes29Bottom">
        <p
          style={{
            margin: "10px 20px 10px auto",
            color: "#c6253d",
            fontWeight: 600,
          }}
          onClick={() => setPopupBudgetAnnuelActes29(true)}
        >
          Modifier le budget annuel
        </p>
        <div className="actes29BudgetYearlyCard">
          <p>
            {budgetAnnuelActes29.budgetAnnuelActes29 || budgetAnnuelActes29} €
          </p>
          <p>Budget annuel</p>
        </div>
        {popupModifyBudget ? (
          <form className="actes29AddCosts" onSubmit={updateBudgetActes29}>
            <p>Modifier une dépense</p>
            <div className="actes29Line">
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
                  value={budgetActes29NewLibelle}
                  onChange={(e) => setBudgetActes29NewLibelle(e.target.value)}
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
                  value={budgetActes29NewMontant}
                  onChange={(e) => setBudgetActes29NewMontant(e.target.value)}
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
                  value={budgetActes29NewType}
                  onChange={(e) => setBudgetActes29NewType(e.target.value)}
                >
                  <option>dépense</option>
                  <option>gain</option>
                </select>
              </label>
            </div>
            <button type="onSubmit">Modifier</button>
          </form>
        ) : (
          <form className="actes29AddCosts" onSubmit={addCostActes29}>
            <p>Ajouter une dépense</p>
            <div className="actes29Line">
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
                  value={budgetActes29Libelle}
                  onChange={(e) => setBudgetActes29Libelle(e.target.value)}
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
                  value={budgetActes29Montant}
                  onChange={(e) => setBudgetActes29Montant(e.target.value)}
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
                  value={budgetActes29Type}
                  onChange={(e) => setBudgetActes29Type(e.target.value)}
                >
                  <option>dépense</option>
                  <option>gain</option>
                </select>
              </label>
            </div>
            <button type="submit">Ajouter</button>
          </form>
        )}

        <div className="actes29GeneralesCardContainer">
          {budgetActes29.map((depense, index) => (
            <div
              key={depense.id}
              className={`actes29GeneralesCardMainContainer ${
                index === activeSlideIndex ? "positionCenter" : "positionLeft"
              }`}
            >
              <div className="actes29GeneralesCard">
                <div className="actes29GeneralesNameAndArrow">
                  <PiPiggyBankFill size={30} />
                  <div
                    className={`actes29GeneralesArrows ${
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
                  {depense.budgetActes29Libelle} -{" "}
                  <span
                    style={{
                      color:
                        depense.budgetActes29Type === "gain" ? "green" : "red",
                    }}
                  >
                    {depense.budgetActes29Montant} €
                  </span>
                </p>
              </div>

              <div className="actes29GeneralesCardContainerCTA">
                <FaEdit
                  style={{ backgroundColor: "#4E77FF" }}
                  className="actes29GeneralesCTA"
                  onClick={() => editBudget(depense)}
                />
                <FaTrashCan
                  style={{ backgroundColor: "#F4244E" }}
                  className="actes29GeneralesCTA"
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
              Confirmez la suppression de "{messageDelete.budgetActes29Libelle}"
              ?
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
                onClick={() => deleteActes29Budget(messageDelete.id)}
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

export default Actes29;
