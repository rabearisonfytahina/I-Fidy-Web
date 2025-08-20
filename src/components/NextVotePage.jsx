import React, { useEffect, useState } from "react";
import "../../public/assets/css/nextVotePage.css";
import { useLanguage } from "../context/LanguageProvider.jsx";
import FormulaireElecteur from "./FormulaireElecteur.jsx";
import VoteStepsPage from "./VoteStepsPage.jsx";

const electionsData = [/* ... tes données comme avant ... */];

const getStatus = (start, end, now) => {
  if (now < start) return "à venir";
  if (now > end) return "terminée";
  return "en cours";
};

const formatCountdown = (endDate) => {
  const now = new Date();
  const diff = endDate - now;
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
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const inProgress = electionsData.filter(
    (e) => getStatus(e.startDate, e.endDate, now) === "en cours"
  );
  const upcoming = electionsData.filter(
    (e) => getStatus(e.startDate, e.endDate, now) === "à venir"
  );
  const ended = electionsData.filter(
    (e) => getStatus(e.startDate, e.endDate, now) === "terminée"
  );

  const renderCard = (election, status) => {
    const isActive = status === "en cours";
    return (
      <div key={election.id} className={`election-card status-${status.replace(" ", "-")}`}>
        <h4>{election.title}</h4>
        <p className="election-description">{election.description}</p>
        <p><span className="icon">📅</span><strong>{t("start")} :</strong> {election.startDate.toLocaleString("fr-FR")}</p>
        <p><span className="icon">📅</span><strong>{t("end")} :</strong> {election.endDate.toLocaleString("fr-FR")}</p>
        {isActive && (
          <p className="countdown">
            <span className="icon">⏳</span><strong>{t("remaining")} :</strong> {formatCountdown(election.endDate)}
          </p>
        )}
        <button
          className="vote-button"
          disabled={!isActive}
          onClick={() => {
            if (isActive) {
              setSlideDirection("left");
              setSlideOut(true);
              setTimeout(() => setRedirectTo("formulaire"), 600);
            }
          }}
        >
          {isActive ? t("participate") : status === "à venir" ? t("coming_soon") : t("closed")}
        </button>
      </div>
    );
  };

  // Redirection conditionnelle
  if (redirectTo === "formulaire") return <FormulaireElecteur />;
  if (redirectTo === "vote-steps") return <VoteStepsPage />;

  return (
    <div className={`next-vote-page ${slideOut ? `slide-${slideDirection}-out` : ""}`}>
      <h2 className="page-title">🗳️ {t("available_elections")}</h2>

      <div className="election-table">
        <div className="election-column">
          <h3 className="section-title in-progress">{t("in_progress")}</h3>
          {inProgress.length ? inProgress.map(e => renderCard(e, "en cours")) : <p className="no-elections">{t("no_in_progress")}</p>}
        </div>
        <div className="election-column">
          <h3 className="section-title upcoming">{t("upcoming")}</h3>
          {upcoming.length ? upcoming.map(e => renderCard(e, "à venir")) : <p className="no-elections">{t("no_upcoming")}</p>}
        </div>
        <div className="election-column">
          <h3 className="section-title ended">{t("ended")}</h3>
          {ended.length ? ended.map(e => renderCard(e, "terminée")) : <p className="no-elections">{t("no_ended")}</p>}
        </div>
      </div>

      {/* ✅ Floating navigation */}
      <div className="floating-nav-bottom-right">
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm me-2"
          onClick={() => {
            setSlideDirection("right");
            setSlideOut(true);
            setTimeout(() => setRedirectTo("vote-steps"), 600);
          }}
        >
          <i className="bi bi-arrow-left me-1"></i> {t("previous")}
        </button>
        <button
          className="btn btn-primary btn-sm rounded-pill shadow-sm"
          onClick={() => {
            setSlideDirection("left");
            setSlideOut(true);
            setTimeout(() => setRedirectTo("formulaire"), 600);
          }}
        >
          {t("next")} <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  );
};

export default NextVotePage;
