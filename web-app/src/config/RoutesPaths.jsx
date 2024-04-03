import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import Membres from "../pages/Membres/Membres";
import Gestion from "../pages/Gestion/Gestion";
import Jeunes from "../pages/Membres/Jeunes/Jeunes";
import Monos from "../pages/Membres/Monos/Monos";
import PetitsGroupes from "../pages/Membres/Petits-Groupes/PetitsGroupes";
import Etudes from "../pages/Etudes/Etudes";
import EtudesGenerales from "../pages/Etudes/Generales/EtudesGenerales";
import EtudesPetitsGroupes from "../pages/Etudes/PetitsGroupes/EtudesPetitsGroupes";
import Programme from "../pages/Gestion/Programme/Programme";
import Presence from "../pages/Gestion/Presence/Presence";
import Contact from "../pages/Gestion/Contact/Contact";
import Transport from "../pages/Gestion/Transport/Transport";
import Dossier from "../pages/Gestion/Dossier/Dossier";
import Activites from "../pages/Activites/Activites";
import Budget from "../pages/Budget/Budget";
import Epevc from "../pages/Budget/epevc/Epevc";
import Actes29 from "../pages/Budget/actes29/Actes29";
import Evenements from "../pages/Budget/evenements/Evenements";
import Parametres from "../pages/parametres/Parametres";
import Prieres from "../pages/Prieres/Prieres";
import Versets from "../pages/Versets/Versets";
import { useAuth } from "../firebase/AuthContext";

const RoutesPaths = () => {
  const host = "TheGoodGones2";
  return (
    <Routes>
      <Route path={"/"} element={<HomePage />}></Route>
      <Route path={`/${host}`} element={<HomePage />}></Route>
      <Route path={`/${host}/membres`} element={<Membres />}></Route>
      <Route path={`/${host}/etudes`} element={<Etudes />}></Route>
      <Route path={`/${host}/budget`} element={<Budget />}></Route>
      <Route path={`/${host}/gestion`} element={<Gestion />}></Route>
      <Route path={`/${host}/activites`} element={<Activites />}></Route>
      <Route path={`/${host}/membres/jeunes`} element={<Jeunes />}></Route>
      <Route path={`/${host}/membres/monos`} element={<Monos />}></Route>
      <Route
        path={`/${host}/membres/petits-groupes`}
        element={<PetitsGroupes />}
      ></Route>
      <Route
        path={`/${host}/etudes/etudes-generales`}
        element={<EtudesGenerales />}
      ></Route>
      <Route
        path={`/${host}/etudes/etudes-petits-groupes`}
        element={<EtudesPetitsGroupes />}
      ></Route>
      <Route
        path={`/${host}/mes-etudes`}
        element={<EtudesPetitsGroupes />}
      ></Route>
      <Route
        path={`/${host}/gestion/programme`}
        element={<Programme />}
      ></Route>
      <Route path={`/${host}/futurs-evenements`} element={<Presence />}></Route>
      <Route path={`/${host}/gestion/contact`} element={<Contact />}></Route>
      <Route
        path={`/${host}/gestion/transport`}
        element={<Transport />}
      ></Route>
      <Route path={`/${host}/gestion/dossier`} element={<Dossier />}></Route>
      <Route path={`/${host}/budget/epevc`} element={<Epevc />}></Route>
      <Route path={`/${host}/budget/actes29`} element={<Actes29 />}></Route>
      <Route
        path={`/${host}/budget/evenements`}
        element={<Evenements />}
      ></Route>
      <Route path={`/${host}/parametres`} element={<Parametres />}></Route>
      <Route path={`/${host}/mes-prieres`} element={<Prieres />}></Route>
      <Route
        path={`/${host}/mes-versets-favoris`}
        element={<Versets />}
      ></Route>
    </Routes>
  );
};

export default RoutesPaths;
