import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { get, ref } from "firebase/database";
import FirebaseConfig from "./FirebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [hasConnected, setHasConnected] = useState(false);

  const setActiveUser = (user) => {
    setCurrentUser(user);
  };

  useEffect(() => {
    const { auth, database } = FirebaseConfig();

    setPersistence(auth, browserSessionPersistence);

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user && !hasConnected) {
        try {
          const possiblePaths = [
            `jeunes/mini-gg/${user.uid}`,
            `jeunes/gg/${user.uid}`,
            `monos/mini-gg/${user.uid}`,
            `monos/gg/${user.uid}`,
          ];

          let userDataFromDB = null;

          for (const path of possiblePaths) {
            const userRef = ref(database, path);
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            if (userData) {
              userDataFromDB = userData;
              break;
            }
          }

          if (userDataFromDB) {
            setUserData(userDataFromDB);
          }

          setHasConnected(true);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur :",
            error.message
          );
        }
      }
    });

    return () => unsubscribeAuth();
  }, [hasConnected]);

  const contextValue = { currentUser, userData, hasConnected, setActiveUser };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
