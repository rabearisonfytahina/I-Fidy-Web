import React, { useState } from "react";
import { useLanguage } from "../context/LanguageProvider.jsx";
import "../../public/assets/css/reconnaissanceFaciale.css";
import ListeCandidat from "./ListeCandidat";

const ReconnaissanceFaciale = () => {
  const [slideOut, setSlideOut] = useState(false);
  const [showNextVote, setShowNextVote] = useState(false);
  const [scanStarted, setScanStarted] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const { t } = useLanguage();

  const handleStartScan = () => {
    setScanStarted(true);
    setTimeout(() => {
      setScanSuccess(true);
      setTimeout(() => {
        setSlideOut(true);
        setTimeout(() => setShowNextVote(true), 600);
      }, 1000);
    }, 2000);
  };

  if (showNextVote) return <ListeCandidat />;

  return (
    <div className={`face-scan-page ${slideOut ? "slide-left-out" : ""}`}>
      <h1 className="face-scan-title">📸 {t("facial_recognition")}</h1>
      <p className="face-scan-subtitle">{t("position_face_instruction")}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <div className="camera-frame">
          <span className="camera-placeholder">📷</span>
        </div>

        <button
          className="scan-button"
          onClick={handleStartScan}
          disabled={scanStarted}
        >
          {scanStarted ? t("scanning") : t("start_scan")}
        </button>
      </div>

      {scanSuccess && (
        <p style={{ marginTop: "2rem", color: "green", fontWeight: "bold" }}>
          ✅ {t("scan_success")}
        </p>
      )}

      {/* ✅ Navigation */}
      <div className="floating-nav-bottom-right">
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm me-2"
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left me-1"></i> {t("previous")}
        </button>
      </div>
    </div>
  );
};

export default ReconnaissanceFaciale;
