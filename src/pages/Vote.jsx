import { useLanguage } from '../context/LanguageProvider.jsx';
import { Link } from 'react-router-dom';
 import VoteStepsPage from "../components/VoteStepsPage.jsx";
 import 'bootstrap-icons/font/bootstrap-icons.css';
 import React, {  useState } from 'react';
 


function Vote() {
  const { t, changeLanguage, language } = useLanguage();
  const [isQrFullScreen, setIsQrFullScreen] = useState(false);

  return (
    <>
      <header className="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <a href="#top" className="logo">
                  <h4>I-<span>Fidy</span></h4>
                </a>

                <ul className="nav">
                  <li className="scroll-to-section">
                    <Link to="/">{t('home')}</Link>
                  </li>

                  <li className="scroll-to-section">
                    <Link to="/aide">{t('aide')}</Link>                  </li>

                  <li className="scroll-to-section">
                    <Link to="/vote">{t('Voter ici')}</Link>
                  </li>

                  <div className="main-red-button">
                    <li className="scroll-to-section">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          changeLanguage(language === 'mg' ? 'fr' : 'mg');
                        }}
                      >
                        <i className="fa fa-globe" aria-hidden="true"></i>
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

                <a className="menu-trigger">
                  <span>Menu</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

 

<div
  className="main-banne wow fadeIn d-flex justify-content-center align-items-center"
  id="top"
  data-wow-duration="1s"
  data-wow-delay="0.5s"
  style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }} 
>
  

 

  
    <VoteStepsPage />

</div>


      
    </>
  );
  
}

export default Vote;
