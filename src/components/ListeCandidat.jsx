import React, { useEffect, useState } from 'react';
import "../../public/assets/css/listeCandidat.css";
import Felicitations from './Felicitations';
import { useLanguage } from '../context/LanguageProvider.jsx'; // ✅ importer

const candidats = [
  {
    id: 1,
    nom: "DOE, John",
    parti: "Indépendant(e)",
    image: "/assets/images/profile-image.jpg",
  },
  {
    id: 2,
    nom: "DOE, Sandra",
    parti: "Appartenance politique",
    image: "/assets/img/sandra.jpg",
  },
  {
    id: 3,
    nom: "UNETELLE, Anne",
    parti: "Appartenance politique",
    image: "/assets/img/anne.jpg",
  },
  {
    id: 4,
    nom: "UNTEL, Pierre",
    parti: "Appartenance politique",
    image: "/assets/img/pierre.jpg",
  },
];

const ListeCandidat = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [slideOut, setSlideOut] = useState(false);
  const [showFelicitations, setShowFelicitations] = useState(false);
  const { t } = useLanguage(); // ✅ hook de langue

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedId !== null) {
      const button = e.currentTarget;
      button.classList.add('delete');

      setTimeout(() => {
        button.classList.remove('delete');
        setSlideOut(true);

        setTimeout(() => {
          setShowFelicitations(true);
        }, 600);
      }, 3200);
    } else {
      alert(t("select_candidate_warning")); // ✅ traduction
    }
  };

  useEffect(() => {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.onclick = null;
    });
  }, []);

  if (showFelicitations) return <Felicitations />;

  return (
    <div className={`vote-container ${slideOut ? "slide-left-out" : ""}`}>
      <header className="page-header">
        <p className="subtitle">{t("choose_candidate_instruction")}</p>
      </header>

      <div className="candidate-list full-width-two-columns">
        {candidats.map((candidat) => (
          <div
            key={candidat.id}
            className={`candidate-card-vertical ${selectedId === candidat.id ? "selected" : ""}`}
            onClick={() => handleSelect(candidat.id)}
          >
            <div className="candidate-number">{candidat.id}</div>
            <div
              className="candidate-photo-vertical"
              style={{ backgroundImage: `url(${candidat.image})` }}
            />
            <div className="candidate-info-vertical">
              <div className="candidate-name">{candidat.nom}</div>
              <div className="candidate-party">{candidat.parti}</div>
            </div>
            <div className="selection-indicator">
              <i className="bi bi-check-circle-fill" />
            </div>
          </div>
        ))}
      </div>

      <div className="submit-container">
        <button className="button" onClick={handleSubmit}>
          <div className="trash">
            <div className="top">
              <div className="paper"></div>
            </div>
            <div className="small-box"></div>
            <div className="check">
              <svg viewBox="0 0 8 6">
                <polyline points="1 3.4 2.71428571 5 7 1" />
              </svg>
            </div>
          </div>
          <span>{t("confirm")}</span>
        </button>
      </div>
    </div>
  );
};

export default ListeCandidat;
