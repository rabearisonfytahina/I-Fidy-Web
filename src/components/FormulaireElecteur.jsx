import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageProvider.jsx';
import ReconnaissanceFaciale from './ReconnaissanceFaciale';
// import { lookupElecteur } from '../services/authElecteur/authElecteurService.js';
import "../../public/assets/css/formulaireElecteur.css";
import { lookupElecteur } from '../services/authElecteur/authElecteurService.js';

const FormulaireElecteur = ({ electionId }) => {
  const [slideOut, setSlideOut] = useState(false);
  const [showFacialPage, setShowFacialPage] = useState(false);
  const [formData, setFormData] = useState({ nom: "", prenom: "", numCIN: "" });
  const [tempToken, setTempToken] = useState(null);
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('FormData : ', formData);
      const res = await lookupElecteur(formData);

      
      setTempToken(res.temp_token); // ✅ reçu du backend
      setSlideOut(true);
      setTimeout(() => setShowFacialPage(true), 600);
    } catch (err) {
      alert("❌ Électeur introuvable ou erreur");
      console.error(err);
    }
  };

  if (showFacialPage) return <ReconnaissanceFaciale idElection={electionId} tempToken={tempToken} />;

  return (
    <div className={`formulaire-electeur-page ${slideOut ? "slide-left-out" : ""}`}>
      <h2>📝 {t("elector_info")}</h2>
      <form onSubmit={handleSubmit} className="formulaire">
        <label>
          {t("lastname")} :
          <input name="nom" value={formData.nom} onChange={handleChange} type="text" required />
        </label>
        <label>
          {t("firstname")} :
          <input name="prenom" value={formData.prenom} onChange={handleChange} type="text" required />
        </label>
        <label>
          {t("id_number")} :
          <input name="numCIN" value={formData.numCIN} onChange={handleChange} type="text" required />
        </label>
        <button type="submit" className="submit-btn">
          {t("submit")}
        </button>
      </form>

      {/* ✅ Boutons navigation */}
      <div className="floating-nav-bottom-right">
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm me-2"
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left me-1"></i> {t("previous")}
        </button>
        <button
          className="btn btn-primary btn-sm rounded-pill shadow-sm"
          onClick={handleSubmit}
        >
          {t("next")} <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  );
};

export default FormulaireElecteur;
