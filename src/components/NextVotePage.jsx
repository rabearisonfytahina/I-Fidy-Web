import React, { useEffect, useState } from "react";
import "../../public/assets/css/nextVotePage.css";
import { useLanguage } from "../context/LanguageProvider.jsx";
import FormulaireElecteur from "./FormulaireElecteur.jsx";
import VoteStepsPage from "./VoteStepsPage.jsx";
import { getAllElections } from "../services/election/electionService.js";
import { getTypeElections } from "../services/election/typeElectionService.js";

const getStatus = (start, end, now) => {
  if (now < start) return "En préparation";
  if (now > end) return "Terminée";
  return "En cours";
};

const formatCountdown = (targetDate) => {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return "00:00:00";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const NextVotePage = () => {
  const [now, setNow] = useState(new Date());
  const [slideOut, setSlideOut] = useState(false);
  const [slideDirection, setSlideDirection] = useState("left");
  const [redirectTo, setRedirectTo] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [electionIdSelected, setElectionIdSelected] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        setLoading(true);
        const data = await getAllElections();
        const typeData = await getTypeElections();

        const typesMap = {};
        typeData.results.forEach((t) => {
          typesMap[t.id_type_election] = t.titre;
        });

        const formatted = data.map((e) => {
          const startDate = new Date(e.dateDebut);
          const endDate = new Date(e.dateFin);
          const typeTitre = typesMap[e.type_election] || "Élection";
          const year = startDate.getFullYear();

          return {
            id: e.id_election,
            title: `${typeTitre} ${year}`,
            description: `Nombre candidats : ${e.nb_candidat_inscrit}`,
            startDate,
            endDate,
            status: getStatus(startDate, endDate, new Date()),
            seuilMajorite: e.seuilMajorite,
            tourActuel: e.tourActuel,
            typeElection: e.type_election,
          };
        });

        setElections(formatted);
      } catch (error) {
        console.error("❌ Erreur résultats :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, []);

  const inProgress = elections.filter((e) => e.status === "En cours");
  const upcoming = elections.filter((e) => e.status === "En préparation");
  const ended = elections.filter((e) => e.status === "Terminée");

  const getFilteredElections = () => {
    switch (activeTab) {
      case "active":
        return inProgress;
      case "upcoming":
        return upcoming;
      case "ended":
        return ended;
      default:
        return elections;
    }
  };

  const renderCard = (election) => {
    const isActive = election.status === "En cours";
    const isUpcoming = election.status === "En préparation";
    const isEnded = election.status === "Terminée";

    return (
      <div
        key={election.id}
        className={`election-card status-${election.status.replace(" ", "-")}`}
      >
        <div className="card-header">
          <h4>{election.title}</h4>
          <span className={`status-badge status-${election.status.replace(" ", "-")}`}>
            {election.status}
          </span>
        </div>
        
        <div className="card-content">
          <p className="election-description">{election.description}</p>
          
          <div className="election-details">
            <div className="detail-item">
              <span className="icon">📅</span>
              <div className="detail-text">
                <strong>{t("start")}</strong>
                <span>{election.startDate.toLocaleString("fr-FR")}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="icon">📅</span>
              <div className="detail-text">
                <strong>{t("end")}</strong>
                <span>{election.endDate.toLocaleString("fr-FR")}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="icon">⏳</span>
              <div className="detail-text">
                <strong>{t("remaining")}</strong>
                {isActive && (
                  <span className="countdown">{formatCountdown(election.endDate)}</span>
                )}
                {isUpcoming && (
                  <span className="countdown">{formatCountdown(election.startDate)}</span>
                )}
                {isEnded && <span>Terminée</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button
            className={`vote-button ${isActive ? "active" : ""}`}
            disabled={!isActive}
            onClick={() => {
              if (isActive) {
                setElectionIdSelected(election.id);
                setSlideDirection("left");
                setSlideOut(true);
                setTimeout(() => setRedirectTo("formulaire"), 600);
              }
            }}
          >
            {isActive
              ? t("participate")
              : isUpcoming
              ? t("coming_soon")
              : "Consulter les résultats"}
          </button>
          
          {isEnded && (
            <button className="results-button">
              Voir les résultats
            </button>
          )}
        </div>
      </div>
    );
  };

  if (redirectTo === "formulaire")
    return <FormulaireElecteur electionId={electionIdSelected} />;

  if (redirectTo === "vote-steps") return <VoteStepsPage />;

  return (
    <div className="page-container">
      <div
        className={`next-vote-page ${
          slideOut ? `slide-${slideDirection}-out` : ""
        }`}
      >
        <div className="page-header">
          <h2 className="page-title">🗳️ {t("available_elections")}</h2>
          <p className="page-subtitle">Participez aux élections en cours ou consultez les résultats des élections terminées</p>
        </div>

        <div className="election-tabs">
          <button 
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Toutes les élections
          </button>
          <button 
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            En cours ({inProgress.length})
          </button>
          <button 
            className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            À venir ({upcoming.length})
          </button>
          <button 
            className={`tab ${activeTab === "ended" ? "active" : ""}`}
            onClick={() => setActiveTab("ended")}
          >
            Terminées ({ended.length})
          </button>
        </div>

        <div className="elections-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des élections...</p>
            </div>
          ) : getFilteredElections().length > 0 ? (
            <div className="election-grid">
              {getFilteredElections().map((e) => renderCard(e))}
            </div>
          ) : (
            <div className="no-elections-container">
              <div className="empty-state">
                <span className="empty-icon">🗳️</span>
                <h3>Aucune élection disponible</h3>
                <p>Il n'y a actuellement aucune élection dans cette catégorie.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextVotePage;