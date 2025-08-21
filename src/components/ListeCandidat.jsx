import React, { useEffect, useState } from "react";
import "../../public/assets/css/listeCandidat.css";
import Felicitations from "./Felicitations";
import { useLanguage } from "../context/LanguageProvider.jsx";
import { getAllCandidats } from "../services/election/candidatService.js";
import { getElecteur } from "../services/electeur/electeurService.js";
import { createVote } from "../services/vote/voteService.js";

const ListeCandidat = ({ electionId }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [slideOut, setSlideOut] = useState(false);
  const [showFelicitations, setShowFelicitations] = useState(false);
  const [candidats, setCandidats] = useState([]);
  const { t } = useLanguage();

  // ✅ Charger les candidats depuis l’API
  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        let data = await getAllCandidats();
        data = data.filter((c) => c.election === electionId);

        const candidatsAvecElecteur = await Promise.all(
          data.map(async (c) => {
            let electeur = null;
            try {
              const res = await getElecteur(c.id_electeur);
              electeur = res.data;
            } catch (err) {
              console.error("Erreur getElecteur :", err);
            }
            return { ...c, electeur };
          })
        );

        setCandidats(candidatsAvecElecteur);
      } catch (err) {
        console.error("❌ Erreur chargement candidats :", err);
      }
    };

    fetchCandidats();
  }, [electionId]);

  const handleSelect = (id) => setSelectedId(id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      alert(t("select_candidate_warning"));
      return;
    }

    try {

      // const electeurId = localStorage.getItem("electeur_id"); // ou ce que tu stockes

      // ⚡ Envoi du vote à l’API
      await createVote({
        election: electionId,
        candidat: selectedId,
      });


      // 🎉 Animation + félicitations
      const button = e.currentTarget;
      button.classList.add("delete");

      setTimeout(() => {
        button.classList.remove("delete");
        setSlideOut(true);

        setTimeout(() => setShowFelicitations(true), 600);
      }, 1200);
    } catch (err) {
      console.error("❌ Erreur soumission vote :", err);
      alert(t("vote_failed"));
    }
  };

  if (showFelicitations) return <Felicitations />;

  return (
    <div className={`vote-container ${slideOut ? "slide-left-out" : ""}`}>
      <header className="page-header">
        <p className="subtitle">{t("choose_candidate_instruction")}</p>
      </header>

      <div className="candidate-list full-width-two-columns">
        {candidats.map((candidat) => (
          <div
            key={candidat.id_candidat}
            className={`candidate-card-vertical ${
              selectedId === candidat.id_candidat ? "selected" : ""
            }`}
            onClick={() => handleSelect(candidat.id_candidat)}
          >
            <div className="candidate-number">{candidat.numCandidat}</div>
            <div
              className="candidate-photo-vertical"
              style={{ backgroundImage: `url(${candidat.photo_candidat})` }}
            />
            <div className="candidate-info-vertical">
              <div className="candidate-name">
                {candidat.electeur
                  ? `${candidat.electeur.prenom_electeur} ${candidat.electeur.nom_electeur}`
                  : candidat.pseudo}
              </div>
              <div className="candidate-party">
                {candidat.biographie || t("no_party")}
              </div>
            </div>
            <div className="selection-indicator">
              <i className="bi bi-check-circle-fill" />
            </div>
          </div>
        ))}
      </div>

      <div className="submit-container">
        <button className="button" onClick={handleSubmit}>
          <div className="trash">
            <div className="top">
              <div className="paper"></div>
            </div>
            <div className="small-box"></div>
            <div className="check">
              <svg viewBox="0 0 8 6">
                <polyline points="1 3.4 2.71428571 5 7 1" />
              </svg>
            </div>
          </div>
          <span>{t("confirm")}</span>
        </button>
      </div>
    </div>
  );
};

export default ListeCandidat;
