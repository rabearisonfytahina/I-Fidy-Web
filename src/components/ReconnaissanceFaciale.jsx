import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageProvider.jsx";
import "../../public/assets/css/reconnaissanceFaciale.css";
import ListeCandidat from "./ListeCandidat";
import api from "../services/api"; // ton axios instance

const ReconnaissanceFaciale = ({ tempToken, idElection }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [slideOut, setSlideOut] = useState(false);
  const [showNextVote, setShowNextVote] = useState(false);
  const [scanStarted, setScanStarted] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const { t } = useLanguage();

  // ✅ Ouvrir la webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const handleStartScan = async () => {
    setScanStarted(true);

    // capture image depuis vidéo
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    // convertir en blob
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("temp_token", tempToken); // ✅ comme attendu par le backend
      formData.append("image_capture", blob, "capture.jpg"); // ✅ le bon nom de champ

      try {
        const res = await api.post("electeurs/auth/face-verify/", formData);
        // res est déjà { access, refresh, electeur }

        console.log("FaceVerify response:", res);

        console.log("Access : "  , res.access);
        // console.log("Refresh : "  , res.refresh);

        if (res?.access) {
          // Sauvegarder les deux tokens
          localStorage.setItem("access_token", res.access);
          // localStorage.setItem("refresh_token", res.refresh);

          setScanSuccess(true);
          setTimeout(() => {
            setSlideOut(true);
            setTimeout(() => setShowNextVote(true), 600);
          }, 1000);
        } else {
          alert("❌ Face verification failed (no access token)");
        }
      } catch (err) {
        console.error("Erreur API FaceVerify:", err);
        alert("❌ Erreur vérification faciale");
        setScanStarted(false);
      }




    }, "image/jpeg");

  };

  if (showNextVote) return <ListeCandidat electionId={idElection}/>;

  return (
    <div className={`face-scan-page ${slideOut ? "slide-left-out" : ""}`}>
      <h1 className="face-scan-title">📸 {t("facial_recognition")}</h1>
      <p className="face-scan-subtitle">{t("position_face_instruction")}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <div className="camera-frame">
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
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
