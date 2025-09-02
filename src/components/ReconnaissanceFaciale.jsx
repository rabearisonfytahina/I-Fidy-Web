import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageProvider.jsx.jsx";
import "../../src/assets/css/reconnaissanceFaciale.css";
import ListeCandidat from "./ListeCandidat";
import { verifyFacial, verifyOtp } from "../services/electeur_auth/electeurAuthService.js";

const ReconnaissanceFaciale = ({ idElection, idAuth }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [slideOut, setSlideOut] = useState(false);
  const [showNextVote, setShowNextVote] = useState(false);
  const [scanStarted, setScanStarted] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(true);
  const authId = idAuth;
  const { t } = useLanguage();

  // Ouvrir la webcam
  useEffect(() => {
    let stream = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" 
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.error("Erreur d'accès à la caméra:", err);
        setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
        setCameraActive(false);
      }
    };

    startCamera();

    // Nettoyage
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartScan = async () => {
    setScanStarted(true);
    setError("");

    // Capture image depuis vidéo
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!video || video.readyState !== 4) {
      setError(t("camera_not_ready"));
      setScanStarted(false);
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir en blob
    canvas.toBlob(async (blob) => {
      try {
        const formData = new FormData();
        formData.append("auth_id", authId);
        formData.append("captured_image", blob, "capture.jpg");

        console.log("📤 Envoi image pour reconnaissance faciale...");
        const response = await verifyFacial(formData);
        console.log("✅ Réponse backend:", response);

        setOtpSent(true);
      } catch (err) {
        console.error("Erreur API FaceVerify:", err);
        setError(t("face_recognition_failed"));
        setScanStarted(false);
      }
    }, "image/jpeg");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.trim() === '') {
      setError(t("otp_required"));
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOtp({
        auth_id: authId,
        otp: password
      });

      const data = response.data || response;
      console.log("✅ OTP validé :", data);

      if (data.status === "valid") {
        setScanSuccess(true);
        setTimeout(() => {
          setSlideOut(true);
          setTimeout(() => setShowNextVote(true), 600);
        }, 1000);
      } else {
        setError(t("otp_invalid"));
      }
    } catch (err) {
      console.error("❌ OTP invalide:", err);
      setError(t("otp_invalid"));
    } finally {
      setLoading(false);
    }
  };

  if (showNextVote) return <ListeCandidat authId={authId} electionId={idElection} />;

  return (
    <div className="face-recognition-container">
      <div className={`face-recognition-page ${slideOut ? "slide-left-out" : ""}`}>
        <div className="recognition-header">          
          <h1 className="page-title">{t("two_step_verification")}</h1>
          <p className="page-subtitle">{t("verify_identity_subtitle")}</p>
        </div>

        {!otpSent ? (
          <div className="facial-recognition-section">
            <div className="camera-container">
              <div className="camera-frame">
                {cameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="camera-video"
                  />
                ) : (
                  <div className="camera-placeholder">
                    <div className="placeholder-icon">📷</div>
                    <p>{t("camera_unavailable")}</p>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                
                <div className="face-overlay">
                  <div className="face-guide"></div>
                </div>
              </div>
              
              <div className="camera-instructions">
                <h3>{t("position_face_instruction")}</h3>
                <ul>
                  <li>{t("well_lit_instruction")}</li>
                  <li>{t("face_in_circle_instruction")}</li>
                  <li>{t("neutral_expression_instruction")}</li>
                  <li>{t("remove_glasses_mask_instruction")}</li>
                </ul>
              </div>
            </div>
            
            <div className="action-buttons">
              <button
                className="nav-button secondary"
                onClick={() => window.history.back()}
                disabled={scanStarted}
              >
                ← {t("back")}
              </button>
              
              <button
                className={`scan-button primary ${scanStarted ? 'scanning' : ''}`}
                onClick={handleStartScan}
                disabled={scanStarted || !cameraActive}
              >
                {scanStarted ? (
                  <>
                    <span className="button-spinner"></span>
                    {t("scanning")}
                  </>
                ) : (
                  t("start_scan")
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="otp-verification-section">
            <div className="verification-header">
              <div className="success-icon">✅</div>
              <h2>{t("face_verification_success")}</h2>
              <p>{t("otp_sent_email")}</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="otp-form">
              <div className="form-group">
                <label htmlFor="otp-code" className="form-label">
                  {t("otp_label")}
                </label>
                <input
                  type="text"
                  id="otp-code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("otp_placeholder")}
                  className="otp-input"
                  required
                  maxLength="6"
                />
                <p className="input-hint">{t("otp_hint")}</p>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button
                  type="button"
                  className="nav-button secondary"
                  onClick={() => setOtpSent(false)}
                >
                  ← {t("back_to_camera")}
                </button>
                
                <button
                  type="submit"
                  className={`verify-button primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      {t("verifying")}
                    </>
                  ) : (
                    t("validate_and_continue")
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {scanSuccess && (
          <div className="success-overlay">
            <div className="success-content">
              <div className="success-animation">✅</div>
              <h3>{t("verification_success")}</h3>
              <p>{t("redirecting_to_vote")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReconnaissanceFaciale;