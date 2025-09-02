import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import "../../src/assets/css/felicitations.css";
import { useLanguage } from "../context/LanguageProvider.jsx"; // ✅ support de langue

const Felicitations = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // 🎉 Confettis
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    // 👏 Applaudissements
    const applause = new Audio("/assets/audio/sond.flac");

    // Lire uniquement si pris en charge
    if (applause.canPlayType("audio/flac")) {
      applause.play().catch((err) => {
        console.error("Erreur lecture audio :", err);
      });
    }

    return () => {
      applause.pause();
      applause.currentTime = 0;
    };
  }, []);

  return (
    <div className="vote-container fade-in felicitations-page">
      <h1 className="felicitations-title">🎉 {t("congrats_title")}</h1>
      <p className="felicitations-text">{t("congrats_text")}</p>
    </div>
  );
};

export default Felicitations;
