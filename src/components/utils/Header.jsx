import React from "react";
import { Link } from "react-router-dom";
import'../../../src/assets/css/header.css'

const Header = ({ t, language, changeLanguage, isQrFullScreen, setIsQrFullScreen }) => {
  return (
    <header className="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              {/* Logo */}
              <a href="#top" className="logo">
                <h4>I-<span>Fidy</span></h4>
              </a>

              {/* Menu */}
              <ul className="nav">
                <li className="scroll-to-section"><a href="#top" className="active">{t("home")}</a></li>
                <li className="scroll-to-section"><Link to="/aide">{t("aide")}</Link></li>
                <li className="scroll-to-section"><Link to="/Vote">{t("Voter ici")}</Link></li>

                {/* Sélecteur de langue */}
                <div className="main-red-button">
                  <li className="scroll-to-section">
                    <a href="#" onClick={(e) => { e.preventDefault(); changeLanguage(language === "mg" ? "fr" : "mg"); }}>
                      <i className="fa fa-globe" aria-hidden="true"></i>
                      {language === "mg" ? "Français" : t("malagasy")}
                    </a>
                  </li>
                </div>

                {/* QR Code */}
                <li className={`qr-code-header ${isQrFullScreen ? "fullscreen" : ""}`}>
                  {isQrFullScreen && (
                    <button className="close-btn" onClick={() => setIsQrFullScreen(false)}>
                      &times;
                    </button>
                  )}
                  <img src="/qrcode.png" alt="QR Code" onClick={() => setIsQrFullScreen(true)} />
                  {!isQrFullScreen && <span>Scan moi !</span>}
                </li>
              </ul>

              {/* Menu Mobile */}
              <a className="menu-trigger"><span>Menu</span></a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
