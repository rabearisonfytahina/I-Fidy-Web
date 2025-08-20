import { useLanguage } from '../context/LanguageProvider.jsx'; // Chemin correct
import { Link } from 'react-router-dom';
 import React, {  useState } from 'react';




function Aide() {
  const { t, changeLanguage, language } = useLanguage();
  const [isQrFullScreen, setIsQrFullScreen] = useState(false);
  
  return (
    <>
    <header className="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <nav className="main-nav">
                    {/* ***** Logo Start ***** */}
                    <a href="#top" className="logo">
                      <h4>I-<span>Fidy</span></h4>
                    </a>
                    {/* ***** Logo End ***** */}
                    {/* ***** Menu Start ***** */}
                    <ul className="nav">
      <li className="scroll-to-section">
        <Link to="/">{t('home')}</Link>
      </li>
    
      {/* Lien vers pages d'aide */}
      <li className="scroll-to-section">
      <Link to="/aide">{t('aide')}</Link>
    </li>
    
      {/* Bouton Voter ici placé avant la langue */}
     <li className="scroll-to-section">
  <Link to="/vote">{t('Voter ici')}</Link>
</li>
    
      {/* Sélecteur de langue à droite avec bordure */}
      <div className="main-red-button">
      <li className="scroll-to-section">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            changeLanguage(language === 'mg' ? 'fr' : 'mg');
          }}
          
        >
          {/* 🌐 Icône de langue ou remplace par <i className="fa fa-globe"></i> si tu utilises FontAwesome */}
          <i className="fa fa-globe  " aria-hidden="true"></i>
          {language === 'mg' ? 'Français' : t('malagasy')}
        </a>
      </li>
    </div>
                          {/* QR Code à droite de la langue */}
     <li
  className={`qr-code-header ${isQrFullScreen ? "fullscreen" : ""}`}
>
  {isQrFullScreen && (
    <button
      className="close-btn"
      onClick={() => setIsQrFullScreen(false)}
    >
      &times;
    </button>
  )}
  <img
    src="/qrcode.png"
    alt="QR Code"
    onClick={() => setIsQrFullScreen(true)}
  />
  {!isQrFullScreen && <span>Scan moi !</span>}
</li>
    
    </ul>
    
                    <a className='menu-trigger'>
                        <span>Menu</span>
                    </a>
                    {/* ***** Menu End ***** */}
                  </nav>
                </div>
              </div>
            </div>
    </header>


  <div className="main-banner wow fadeIn" id="top" data-wow-duration="1s" data-wow-delay="0.5s">
  <div className="container">
    <div className="row border">
      <p>lorem</p>
      
    </div>
  </div>
  </div>

  
</>
    
    
  );
}

export default Aide;
