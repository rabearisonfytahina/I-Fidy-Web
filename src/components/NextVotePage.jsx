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

  // ✅ Nouvel état pour stocker l'ID sélectionné
  const [electionIdSelected, setElectionIdSelected] = useState(null);

  const [elections, setElections] = useState([]);
  const { t } = useLanguage();

  // timer pour rafraîchir l'heure
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // récupération des élections et types depuis API
  useEffect(() => {
    const fetchElection = async () => {
      try {
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
      }
    };

    fetchElection();
  }, []);

  // tri par statut
  const inProgress = elections.filter((e) => e.status === "En cours");
  const upcoming = elections.filter((e) => e.status === "En préparation");
  const ended = elections.filter((e) => e.status === "Terminée");

  const renderCard = (election) => {
    const isActive = election.status === "En cours";
    const isUpcoming = election.status === "En préparation";
    const isEnded = election.status === "Terminée";

    return (
      <div
        key={election.id}
        className={`election-card status-${election.status.replace(" ", "-")}`}
      >
        <h4 style={{ textAlign: "center" }}>{election.title}</h4>
        <p className="election-description">{election.description}</p>
        <p>
          <span className="icon">📅</span>
          <strong>{t("start")} : </strong>{" "}
          {election.startDate.toLocaleString("fr-FR")}
        </p>
        <p>
          <span className="icon">📅</span>
          <strong>{t("end")} : </strong>{" "}
          {election.endDate.toLocaleString("fr-FR")}
        </p>

        {/* ⏳ Temps restant */}
        {isActive && (
          <p className="countdown">
            <span className="icon">⏳</span>
            <strong>{t("remaining")} : </strong>{" "}
            {formatCountdown(election.endDate)}
          </p>
        )}
        {isUpcoming && (
          <p className="countdown">
            <span className="icon">⏳</span>
            <strong>{t("remaining")} : </strong>{" "}
            {formatCountdown(election.startDate)}
          </p>
        )}
        {isEnded && (
          <p className="countdown">
            <span className="icon">⏳</span>
            <strong>{t("remaining")} : </strong> Terminée
          </p>
        )}

        {/* bouton */}
        <button
          className="vote-button"
          disabled={!isActive}
          onClick={() => {
            if (isActive) {
              // ✅ On stocke l'ID sélectionné
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
            : "Terminé"}
        </button>
      </div>
    );
  };

  // ✅ Redirection conditionnelle avec passage de props
  if (redirectTo === "formulaire")
    return <FormulaireElecteur electionId={electionIdSelected} />;

  if (redirectTo === "vote-steps") return <VoteStepsPage />;

  return (
    <div
      className={`next-vote-page ${
        slideOut ? `slide-${slideDirection}-out` : ""
      }`}
    >
      <h2 className="page-title">🗳️ {t("available_elections")}</h2>

      <div className="election-table">
        <div className="election-column">
          <h3 className="section-title in-progress">{t("in_progress")}</h3>
          {inProgress.length ? (
            inProgress.map((e) => renderCard(e))
          ) : (
            <p className="no-elections">{t("no_in_progress")}</p>
          )}
        </div>
        <div className="election-column">
          <h3 className="section-title upcoming">{t("upcoming")}</h3>
          {upcoming.length ? (
            upcoming.map((e) => renderCard(e))
          ) : (
            <p className="no-elections">{t("no_upcoming")}</p>
          )}
        </div>
        <div className="election-column">
          <h3 className="section-title ended">{t("ended")}</h3>
          {ended.length ? (
            ended.map((e) => renderCard(e))
          ) : (
            <p className="no-elections">{t("no_ended")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextVotePage;
