import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageProvider.jsx';
import ReconnaissanceFaciale from './ReconnaissanceFaciale';
import "../../public/assets/css/formulaireElecteur.css";

const FormulaireElecteur = () => {
  const [slideOut, setSlideOut] = useState(false);
  const [showFacialPage, setShowFacialPage] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSlideOut(true);
    setTimeout(() => setShowFacialPage(true), 600);
  };

  if (showFacialPage) return <ReconnaissanceFaciale />;

  return (
    <div className={`formulaire-electeur-page ${slideOut ? "slide-left-out" : ""}`}>
      <h2>📝 {t("elector_info")}</h2>
      <form onSubmit={handleSubmit} className="formulaire">
        <label>
          {t("lastname")} :
          <input type="text" required />
        </label>
        <label>
          {t("firstname")} :
          <input type="text" required />
        </label>
        <label>
          {t("id_number")} :
          <input type="text" required />
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
