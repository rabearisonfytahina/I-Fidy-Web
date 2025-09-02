import React, { useEffect, useState } from "react";
import "../assets/css/listeCandidat.css";
import Felicitations from "./Felicitations";
import { useLanguage } from "../context/LanguageProvider.jsx";
import { getAllCandidats } from "../services/election/candidatService.js";
import { getElecteur } from "../services/electeur/electeurService.js";
import { checkIfVoted, createVote } from "../services/vote/voteService.js";
import { useNavigate } from "react-router-dom";

const ListeCandidat = ({ authId, electionId }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [slideOut, setSlideOut] = useState(false);
  const [showFelicitations, setShowFelicitations] = useState(false);
  const [candidats, setCandidats] = useState([]);
  const { t } = useLanguage();

  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyVote = async () => {
      try {
        const res = await checkIfVoted(electionId, authId);
        if (res.has_voted) {
          setAlreadyVoted(true);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (err) {
        console.error("Erreur check vote :", err);
      } finally {
        setLoading(false);
      }
    };

    verifyVote();
  }, [authId, electionId, navigate]);

  // ✅ Charger les candidats depuis l'API
  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        let data = await getAllCandidats();
        data = data.filter((c) => c.election === electionId);

        const candidatsAvecElecteur = await Promise.all(
          data.map(async (c) => {
            try {
              const res = await getElecteur(c.id_electeur);
              return { ...c, electeur: res.data };
            } catch (err) {
              console.error("Erreur getElecteur :", err);
              return { ...c, electeur: null };
            }
          })
        );

        setCandidats(candidatsAvecElecteur);
      } catch (err) {
        console.error("❌ Erreur chargement candidats :", err);
      }
    };

    fetchCandidats();
  }, [electionId]);

  const handleSelect = (id) => {
    setSelectedId(id);
    
    // Animation de sélection
    const cards = document.querySelectorAll('.candidate-card-vertical');
    cards.forEach(card => {
      if (card.dataset.id === id.toString()) {
        card.classList.add('pulse');
        setTimeout(() => card.classList.remove('pulse'), 500);
      }
    });
  };


  const handleSubmit = async () => {
    if (submitting) return;

    if (!selectedId) {
      const button = document.querySelector('.submit-button');
      button.classList.add('shake');
      setTimeout(() => button.classList.remove('shake'), 500);

      alert(t("select_candidate_warning"));
      return;
    }

    setSubmitting(true);

    try {
      const response = await createVote({
        auth_id: authId,
        election: electionId,
        candidat: selectedId,
      });

      console.log("✅ Vote enregistré :", response);

      const button = document.querySelector('.submit-button');
      button.classList.add("submitting");

      setTimeout(() => {
        setSlideOut(true);
        setTimeout(() => setShowFelicitations(true), 600);
      }, 1500);
    } catch (err) {
      console.error("❌ Erreur soumission vote :", err);
      alert(t("vote_failed"));
      setSubmitting(false);
    }
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (submitting) return; // Empêcher les doubles clics
    
  //   if (!selectedId) {
  //     // Animation d'avertissement
  //     const button = document.querySelector('.submit-button');
  //     button.classList.add('shake');
  //     setTimeout(() => button.classList.remove('shake'), 500);
      
  //     alert(t("select_candidate_warning"));
  //     return;
  //   }

  //   setSubmitting(true);
    
  //   try {
  //     const response = await createVote({
  //       auth_id: authId,
  //       election: electionId,
  //       candidat: selectedId,
  //     });

  //     console.log("✅ Vote enregistré :", response);
      
  //     // Animation de confirmation
  //     const button = e.currentTarget;
  //     button.classList.add("submitting");
      
  //     setTimeout(() => {
  //       setSlideOut(true);
  //       setTimeout(() => setShowFelicitations(true), 600);
  //     }, 1500);
  //   } catch (err) {
  //     console.error("❌ Erreur soumission vote :", err);
  //     alert(t("vote_failed"));
  //     setSubmitting(false);
  //   }
  // };

  if (showFelicitations) return <Felicitations />;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des candidats...</p>
      </div>
    );
  }

  if (alreadyVoted) {
    return (
      <div className="already-voted-container">
        <div className="already-voted-card">
          <div className="warning-icon">⚠️</div>
          <h2>Vous avez déjà voté</h2>
          <p>Votre session est terminée. Vous allez être redirigé vers l'accueil.</p>
          <div className="countdown">
            <div className="countdown-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`vote-container ${slideOut ? "slide-left-out" : ""}`}>
      <header className="page-header">
        <h1>Élection en cours</h1>
        <p className="subtitle">{t("choose_candidate_instruction")}</p>
      </header>

      <div className="candidate-list full-width-two-columns">
        {candidats.map((candidat) => (
          <div
            key={candidat.id_candidat}
            data-id={candidat.id_candidat}
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
        {/* <button 
          className={`submit-button ${submitting ? "submitting" : ""}`} 
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <div className="button-loading">
              <div className="spinner"></div>
              <span>Enregistrement...</span>
            </div>
          ) : (
            <>
              <div className="button-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
              <span>{t("confirm")}</span>
            </>
          )}
        </button> */}

        <button
          type="button"   // 🔥 empêche la soumission implicite du formulaire
          className={`submit-button ${submitting ? "submitting" : ""}`}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <div className="button-loading">
              <div className="spinner"></div>
              <span>Enregistrement...</span>
            </div>
          ) : (
            <>
              <div className="button-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
              <span>{t("confirm")}</span>
            </>
          )}
        </button>


      </div>
    </div>
  );
};

export default ListeCandidat;