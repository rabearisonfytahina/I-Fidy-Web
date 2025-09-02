// src/components/Aide.jsx
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageProvider.jsx';
import { Link } from 'react-router-dom';
import '../assets/css/aide.css';

export default function Aide() {
  const { t, changeLanguage, language } = useLanguage();
  const [isQrFullScreen, setIsQrFullScreen] = useState(false);

  // Liste des sujets d'aide
  const topics = [
    {
      id: "vote-navigation",
      title: t("aide_vote_navigation_title"),
      content: t("aide_vote_navigation_content"),
    },
    {
      id: "choose-vote",
      title: t("aide_choose_vote_title"),
      content: t("aide_choose_vote_content"),
    },
    {
      id: "facial-recognition",
      title: t("aide_facial_recognition_title"),
      content: t("aide_facial_recognition_content"),
    },
    {
      id: "personal-info",
      title: t("aide_personal_info_title"),
      content: t("aide_personal_info_content"),
    },
    {
      id: "using-platform",
      title: t("aide_using_platform_title"),
      content: t("aide_using_platform_content"),
    },
    {
      id: "tips",
      title: t("aide_tips_title"),
      content: t("aide_tips_content"),
    },
  ];

  return (
    <>
      {/* Header personnalisé */}
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
                    <Link to="/aide">{t('aide')}</Link>
                  </li>
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
                  <li className={`qr-code-header ${isQrFullScreen ? "fullscreen" : ""}`}>
                    {isQrFullScreen && (
                      <button className="close-btn" onClick={() => setIsQrFullScreen(false)}>&times;</button>
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
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Titre principal */}
      <h1 className="aide-title">{t("aide_title")}</h1>

      {/* Contenu d'aide */}
      <div className="aide-container">
        <nav className="aide-sidebar">
          <ul>
            {topics.map((topic) => (
              <li key={topic.id}>
                <a href={`#${topic.id}`}>{topic.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="aide-content">
          {topics.map((topic) => (
            <section key={topic.id} id={topic.id} className="aide-section">
              <h2>{topic.title}</h2>
              <p>{topic.content}</p>
            </section>
          ))}
        </main>
      </div>
    </>
  );
}
