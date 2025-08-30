import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageProvider.jsx.jsx";
import "../../public/assets/css/reconnaissanceFaciale.css";
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
    setError('');

    // Capture image depuis vidéo
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!video || video.readyState !== 4) {
      setError("La caméra n'est pas prête. Veuillez réessayer.");
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
        setError("Échec de la reconnaissance faciale. Veuillez réessayer.");
        setScanStarted(false);
      }
    }, "image/jpeg");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.trim() === '') {
      setError('Veuillez entrer le code reçu par email');
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
        setError("Code invalide ou expiré");
      }
    } catch (err) {
      console.error("❌ OTP invalide:", err);
      setError("Code invalide ou expiré");
    } finally {
      setLoading(false);
    }
  };

  if (showNextVote) return <ListeCandidat authId={authId} electionId={idElection} />;

  return (
    <div className="face-recognition-container">
      <div className={`face-recognition-page ${slideOut ? "slide-left-out" : ""}`}>
        <div className="recognition-header">          
          <h1 className="page-title">Vérification en deux étapes</h1>
          <p className="page-subtitle">Pour garantir la sécurité de votre vote, nous avons besoin de vérifier votre identité</p>
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
                    <p>Caméra non disponible</p>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                
                <div className="face-overlay">
                  <div className="face-guide"></div>
                </div>
              </div>
              
              <div className="camera-instructions">
                <h3>Positionnez votre visage</h3>
                <ul>
                  <li>Assurez-vous d'être dans un endroit bien éclairé</li>
                  <li>Positionnez votre visage dans le cercle</li>
                  <li>Maintenez une expression neutre</li>
                  <li>Enlevez les lunettes de soleil ou masques</li>
                </ul>
              </div>
            </div>
            
            <div className="action-buttons">
              <button
                className="nav-button secondary"
                onClick={() => window.history.back()}
                disabled={scanStarted}
              >
                ← Retour
              </button>
              
              <button
                className={`scan-button primary ${scanStarted ? 'scanning' : ''}`}
                onClick={handleStartScan}
                disabled={scanStarted || !cameraActive}
              >
                {scanStarted ? (
                  <>
                    <span className="button-spinner"></span>
                    Vérification en cours...
                  </>
                ) : (
                  'Lancer la reconnaissance faciale'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="otp-verification-section">
            <div className="verification-header">
              <div className="success-icon">✅</div>
              <h2>Vérification faciale réussie</h2>
              <p>Un code de sécurité a été envoyé à votre adresse email</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="otp-form">
              <div className="form-group">
                <label htmlFor="otp-code" className="form-label">
                  Code de vérification
                </label>
                <input
                  type="text"
                  id="otp-code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisissez le code à 6 chiffres"
                  className="otp-input"
                  required
                  maxLength="6"
                />
                <p className="input-hint">Vérifiez votre boîte email pour le code de sécurité</p>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button
                  type="button"
                  className="nav-button secondary"
                  onClick={() => setOtpSent(false)}
                >
                  ← Retour à la caméra
                </button>
                
                <button
                  type="submit"
                  className={`verify-button primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      Vérification...
                    </>
                  ) : (
                    'Valider et continuer →'
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
              <h3>Vérification réussie!</h3>
              <p>Redirection vers l'interface de vote...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReconnaissanceFaciale;