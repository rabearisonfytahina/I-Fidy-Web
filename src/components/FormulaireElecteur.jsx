import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageProvider.jsx';
import ReconnaissanceFaciale from './ReconnaissanceFaciale';
import "../../public/assets/css/formulaireElecteur.css";
import { verifyIdentifiants } from '../services/electeur_auth/electeurAuthService.js';

// Composant de notification
const Notification = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

const FormulaireElecteur = ({ electionId }) => {
  const [slideOut, setSlideOut] = useState(false);
  const [showFacialPage, setShowFacialPage] = useState(false);
  const [formData, setFormData] = useState({ nom: "", prenom: "", numCIN: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notifications, setNotifications] = useState([]);
  const { t } = useLanguage();
  const [authId, setAuthId] = useState(null);

  // Fonction pour ajouter une notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    return id;
  };

  // Fonction pour supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Effacer l'erreur du champ lorsqu'il est modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = t("lastname_required");
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = t("firstname_required");
    }
    
    if (!formData.numCIN.trim()) {
      newErrors.numCIN = t("id_required");
    } else if (formData.numCIN.length < 4) {
      newErrors.numCIN = t("id_invalid");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification(t("form_validation_failed"), "error");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('📤 Vérification des identifiants:', formData);
      const response = await verifyIdentifiants(formData);
      console.log('✅ Réponse backend:', response);

      setAuthId(response.auth_id);

      // ✅ Sauvegarde dans localStorage pour persister entre refresh
      localStorage.setItem("electeurAuth", JSON.stringify({ authId: response.auth_id }));

      addNotification(t("identity_verified_successfully"), "success");
      
      setSlideOut(true);
      setTimeout(() => setShowFacialPage(true), 600);

    } catch (err) {
      console.error(err);
      addNotification(
        err.response?.data?.message || t("elector_not_found_error"), 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (showFacialPage) return <ReconnaissanceFaciale idElection={electionId} idAuth={authId}/>;

  return (
    <div className="formulaire-container">
      {/* Zone de notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
      
      <div className={`formulaire-electeur-page ${slideOut ? "slide-left-out" : ""}`}>
        <div className="form-header">
          <div className="form-progress">
            <div className="progress-step active">
              <div className="step-number">1</div>
              <span className="step-label">{t("elector_info")}</span>
            </div>
            <div className="progress-connector"></div>
            <div className="progress-step">
              <div className="step-number">2</div>
              <span className="step-label">{t("facial_recognition")}</span>
            </div>
          </div>
          
          <h2>{t("elector_info")}</h2>
          <p className="form-subtitle">{t("enter_your_details")}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="formulaire">
          <div className="form-group">
            <label htmlFor="nom" className="form-label">
              {t("lastname")} *
            </label>
            <input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              type="text"
              className={`form-input ${errors.nom ? 'error' : ''}`}
              placeholder={t("enter_lastname")}
              disabled={loading}
            />
            {errors.nom && <span className="error-message">{errors.nom}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="prenom" className="form-label">
              {t("firstname")} *
            </label>
            <input
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              type="text"
              className={`form-input ${errors.prenom ? 'error' : ''}`}
              placeholder={t("enter_firstname")}
              disabled={loading}
            />
            {errors.prenom && <span className="error-message">{errors.prenom}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="numCIN" className="form-label">
              {t("id_number")} *
            </label>
            <input
              id="numCIN"
              name="numCIN"
              value={formData.numCIN}
              onChange={handleChange}
              type="text"
              className={`form-input ${errors.numCIN ? 'error' : ''}`}
              placeholder={t("enter_id_number")}
              disabled={loading}
            />
            {errors.numCIN && <span className="error-message">{errors.numCIN}</span>}
          </div>
          
          <button 
            type="submit" 
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {t("verifying")}
              </>
            ) : (
              <>
                {t("verify_identity")}
                <span className="btn-icon">→</span>
              </>
            )}
          </button>
        </form>

        <div className="navigation-buttons">
          <button
            className="nav-btn prev-btn"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            <span className="btn-icon">←</span>
            {t("previous")}
          </button>
          
          <div className="form-help">
            <p className="help-text">
              <span className="help-icon">❓</span>
              {t("form_help_text")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaireElecteur;

// import React, { useState } from 'react';
// import { useLanguage } from '../context/LanguageProvider.jsx';
// import ReconnaissanceFaciale from './ReconnaissanceFaciale';
// import "../../public/assets/css/formulaireElecteur.css";

// import {verifyIdentifiants} from '../services/electeur_auth/electeurAuthService.js'

// const FormulaireElecteur = ({ electionId }) => {
//   const [slideOut, setSlideOut] = useState(false);
//   const [showFacialPage, setShowFacialPage] = useState(false);
//   const [formData, setFormData] = useState({ nom: "", prenom: "", numCIN: "" });
//   // const [tempToken, setTempToken] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const { t } = useLanguage();
//   const [authId, setAuthId] = useState(null)
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // Effacer l'erreur du champ lorsqu'il est modifié
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: '' });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.nom.trim()) {
//       newErrors.nom = t("lastname_required");
//     }
    
//     if (!formData.prenom.trim()) {
//       newErrors.prenom = t("firstname_required");
//     }
    
//     if (!formData.numCIN.trim()) {
//       newErrors.numCIN = t("id_required");
//     } else if (formData.numCIN.length < 4) {
//       newErrors.numCIN = t("id_invalid");
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//         console.log('📤 Vérification des identifiants:', formData);
//         const response = await verifyIdentifiants(formData);
//         console.log('✅ Réponse backend:', response);
  
//         setAuthId(response.auth_id);
  
//         // ✅ Sauvegarde dans localStorage pour persister entre refresh
//         localStorage.setItem("electeurAuth", JSON.stringify({ authId: response.auth_id }));
  
//         setSlideOut(true);
//         setTimeout(() => setShowFacialPage(true), 600);
  
//       } catch (err) {
//         alert("❌ Électeur introuvable ou erreur");
//         console.error(err);
//       }
//   };
  
  
//   if (showFacialPage) return <ReconnaissanceFaciale idElection={electionId} idAuth={authId}/>;


//   // if (showFacialPage) return <ReconnaissanceFaciale idElection={electionId} tempToken={tempToken} />;

//   return (
//     <div className="formulaire-container">
//       <div className={`formulaire-electeur-page ${slideOut ? "slide-left-out" : ""}`}>
//         <div className="form-header">
//           <div className="form-progress">
//             <div className="progress-step active">
//               <div className="step-number">1</div>
//               <span className="step-label">{t("elector_info")}</span>
//             </div>
//             <div className="progress-connector"></div>
//             <div className="progress-step">
//               <div className="step-number">2</div>
//               <span className="step-label">{t("facial_recognition")}</span>
//             </div>
//           </div>
          
//           <h2>📝 {t("elector_info")}</h2>
//           <p className="form-subtitle">{t("enter_your_details")}</p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="formulaire">
//           <div className="form-group">
//             <label htmlFor="nom" className="form-label">
//               {t("lastname")} *
//             </label>
//             <input
//               id="nom"
//               name="nom"
//               value={formData.nom}
//               onChange={handleChange}
//               type="text"
//               className={`form-input ${errors.nom ? 'error' : ''}`}
//               placeholder={t("enter_lastname")}
//               disabled={loading}
//             />
//             {errors.nom && <span className="error-message">{errors.nom}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="prenom" className="form-label">
//               {t("firstname")} *
//             </label>
//             <input
//               id="prenom"
//               name="prenom"
//               value={formData.prenom}
//               onChange={handleChange}
//               type="text"
//               className={`form-input ${errors.prenom ? 'error' : ''}`}
//               placeholder={t("enter_firstname")}
//               disabled={loading}
//             />
//             {errors.prenom && <span className="error-message">{errors.prenom}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="numCIN" className="form-label">
//               {t("id_number")} *
//             </label>
//             <input
//               id="numCIN"
//               name="numCIN"
//               value={formData.numCIN}
//               onChange={handleChange}
//               type="text"
//               className={`form-input ${errors.numCIN ? 'error' : ''}`}
//               placeholder={t("enter_id_number")}
//               disabled={loading}
//             />
//             {errors.numCIN && <span className="error-message">{errors.numCIN}</span>}
//           </div>
          
//           <button 
//             type="submit" 
//             className={`submit-btn ${loading ? 'loading' : ''}`}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner"></span>
//                 {t("verifying")}
//               </>
//             ) : (
//               <>
//                 {t("verify_identity")}
//                 <span className="btn-icon">→</span>
//               </>
//             )}
//           </button>
//         </form>

//         <div className="navigation-buttons">
//           <button
//             className="nav-btn prev-btn"
//             onClick={() => window.history.back()}
//             disabled={loading}
//           >
//             <span className="btn-icon">←</span>
//             {t("previous")}
//           </button>
          
//           <div className="form-help">
//             <p className="help-text">
//               <span className="help-icon">❓</span>
//               {t("form_help_text")}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormulaireElecteur;