import React, { useEffect, useState } from 'react';
import { useLanguage } from './context/LanguageProvider.jsx'; // Chemin correct
import { Link } from 'react-router-dom';
import { getAllTypeElections } from './services/election/typeElectionService.js';


function App() {
  const { t, changeLanguage, language } = useLanguage(); // Ajoutez 'language' ici
  const [isQrFullScreen, setIsQrFullScreen] = useState(false);
  const [typeElection, setTypeElection] = useState([]);
  // useEffect pour l'initialisation des scripts externes et des écouteurs d'événements
  useEffect(() => {
    // Initialiser WOW.js si elle existe
    if (window.WOW) {
      new window.WOW().init();
    }

    // Gérer le menu-trigger pour la navigation mobile
    const menuTrigger = document.querySelector('.menu-trigger');
    const mainNav = document.querySelector('.header-area .nav');

    const handleMenuClick = () => {
      menuTrigger.classList.toggle('active');
      mainNav.classList.toggle('active');
    };  

    if (menuTrigger) {
      menuTrigger.addEventListener('click', handleMenuClick);
    }

    // Gérer la classe active du scroll-to-section
    const navLinks = document.querySelectorAll('.main-nav .scroll-to-section a');
    const sections = document.querySelectorAll('div[id]');

    const handleScroll = () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // Ajustez cette valeur pour un meilleur point de déclenchement (par exemple, 1/3 de la hauteur de la section)
        if (window.scrollY >= sectionTop - section.clientHeight / 3) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    // Nettoyage des écouteurs d'événements au démontage du composant
    return () => {
      if (menuTrigger) {
        menuTrigger.removeEventListener('click', handleMenuClick);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Le tableau de dépendances vide garantit que cela ne s'exécute qu'une fois au montage





  return (
    <>
      {/* ***** Header Area Start ***** */}
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
                  <li className="scroll-to-section"><a href="#top" className="active">{t('home')}</a></li>

                  {/* Lien vers pages d'aide */}
                  <li className="scroll-to-section">
                    <Link to="/aide">{t('aide')}</Link>
                  </li>

                  {/* Bouton Voter ici placé avant la langue */}
                  <li className="scroll-to-section">
                    <Link to="/Vote">{t('Voter ici').replace('VOter')}</Link>
                  </li>

                  {/* Sélecteur de langue à droite avec bordure */}
                  <div className="main-red-button">                    
                    <li className="scroll-to-section ">
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
      {/* ***** Header Area End ***** */}

      <div className="main-banner wow fadeIn" id="top" data-wow-duration="1s" data-wow-delay="0.5s">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-6 align-self-center">
                  <div className="left-content header-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="1s">
                    <h6>{t('welcome_title')}</h6>
                    <h2>{t('platform_subtitle').replace('filoham-pirenena', 'filoham-pirenena').replace('Madagasikara', 'Madagasikara')}</h2>
                    <p>{t('platform_description')}</p>
                    <form id="search" action="#" method="GET">
                      <fieldset>
                        <input type="text" name="address" className="email" placeholder={t('search_placeholder')} autoComplete="on" required />
                      </fieldset>
                      <fieldset>
                        <button type="submit" className="main-button">{t('search_button')}</button>
                      </fieldset>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="right-image wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/assets/images/banner-right-image.png.png" className='photo' alt={t('secure_elections_image_alt')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="about" className="about-us section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="left-image wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
                <img src="/assets/images/about-left-image.png" alt={t('security_features_title')} />
              </div>
            </div>
            <div className="col-lg-8 align-self-center">
              <div className="services">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="0.5s">
                      <div className="icon">
                        <img src="/assets/images/service-icon-01.png" alt={t('enhanced_security')} />
                      </div>
                      <div className="right-text">
                        <h4>{t('enhanced_security')}</h4>
                        <p className='text-red'>{t('strong_authentication')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="0.7s">
                      <div className="icon">
                        <img src="/assets/images/service-icon-02.png" alt={t('full_accessibility')} />
                      </div>
                      <div className="right-text">
                        <h4>{t('full_accessibility')}</h4>
                        <p>{t('vote_easily')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="0.9s">
                      <div className="icon">
                        <img src="/assets/images/service-icon-03.png" alt={t('transparency')} />
                      </div>
                      <div className="right-text">
                        <h4>{t('transparency')}</h4>
                        <p>{t('real_time_monitoring')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="1.1s">
                      <div className="icon">
                        <img src="/assets/images/service-icon-04.png" alt={t('dedicated_support')} />
                      </div>
                      <div className="right-text">
                        <h4>{t('dedicated_support')}</h4>
                        <p>{t('assistance_information')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="services" className="our-services section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center  wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
              <div className="left-image">
                <img src="/assets/images/services-left-image.png" alt={t('understand_platform_title')} />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
              <div className="section-heading">
                <h2>{t('understand_platform_title').replace("fiasan'ny", "fiasan'ny").replace('I-FIDY', 'I-FIDY')}</h2>
                <p>{t('innovative_solution_description')}</p>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="first-bar progress-skill-bar">
                    <h4>{t('secure_authentication_progress')}</h4>
                    <span>100%</span>
                    <div className="filled-bar"></div>
                    <div className="full-bar"></div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="second-bar progress-skill-bar">
                    <h4>{t('vote_encryption_progress')}</h4>
                    <span>100%</span>
                    <div className="filled-bar"></div>
                    <div className="full-bar"></div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="third-bar progress-skill-bar">
                    <h4>{t('real_time_results_progress')}</h4>
                    <span>100%</span>
                    <div className="filled-bar"></div>
                    <div className="full-bar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="portfolio" className="our-portfolio section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading  wow bounceIn" data-wow-duration="1s" data-wow-delay="0.2s">
                <h2>{t('discover_candidates_title').replace('kandidà', 'kandidà').replace('filoham-pirenena', 'filoham-pirenena')}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-sm-4">
              <a href="#">
                <div className="item wow bounceInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                  <div className="hidden-content">
                    {/* <h4>{t('candidate')} 1</h4> */}
                    <p>{t('candidate_description')}</p>
                  </div>
                  <div className="showed-content">
                    <img src="/assets/images/6442702.png" alt={t('candidate') + ' 1'} />
                  </div>
                </div>
              </a>
            </div>
            <div className="col-lg-4 col-sm-4">
              <a href="#">
                <div className="item wow bounceInUp" data-wow-duration="1s" data-wow-delay="0.4s">
                  <div className="hidden-content">
                    {/* <h4>{t('candidate')} 2</h4> */}
                    <p>{t('candidate_description2')}</p>
                  </div>
                  <div className="showed-content">
                    <img src="/assets/images/portfolio-image.png" alt={t('candidate') + ' 2'} />
                  </div>
                </div>
              </a>
            </div>
            <div className="col-lg-4 col-sm-4">
              <a href="#">
                <div className="item wow bounceInUp" data-wow-duration="1s" data-wow-delay="0.5s">
                  <div className="hidden-content">
                    <h4>{t('candidate')} 3</h4>
                    <p>{t('candidate_description3')}</p>
                  </div>
                  <div className="showed-content">
                    <img src="/assets/images/portfolio-image.png" alt={t('candidate') + ' 3'} />
                  </div>
                </div>
              </a>
            </div>
            {/* <div className="col-lg-3 col-sm-6">
              <a href="#">
                <div className="item wow bounceInUp" data-wow-duration="1s" data-wow-delay="0.6s">
                  <div className="hidden-content">
                    <h4>{t('candidate')} 4</h4>
                    <p>{t('candidate_description')}</p>
                  </div>
                  <div className="showed-content">
                    <img src="/assets/images/portfolio-image.png" alt={t('candidate') + ' 4'} />
                  </div>
                </div>
              </a>
            </div> */}
          </div>
        </div>
      </div>

      <div id="blog" className="our-blog section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.25s">
              <div className="section-heading">
                <h2>{t('news_information_title').replace('sy fampahalalana', 'sy fampahalalana').replace('fifidianana elektronika', 'fifidianana elektronika')}</h2>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.25s">
              <div className="top-dec">
                <img src="/assets/images/blog-dec.png" alt={t('news_information_title')} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
              <div className="left-image">
                <a href="#"><img src="/assets/images/big-blog-thumb.jpg" alt={t('election_news_image_alt')} /></a>
                <div className="info">
                  <div className="inner-content">
                    <ul>
                      {/* <li><i className="fa fa-calendar"></i> {t('news_date')}</li> */}
                      <li><i className="fa fa-users"></i> {t('news_author')}</li>
                      <li><i className="fa fa-folder"></i> {t('news_category')}</li>
                    </ul>
                    <a href="#"><h4>{t('secure_e_voting_article_title')}</h4></a>
                    <p>{t('secure_e_voting_article_description')}</p>
                    <div className="main-blue-button">
                      <a href="#">{t('learn_more')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
              <div className="right-list">
                <ul>
                  <li>
                    <div className="left-content align-self-center">
                      <a href="#"><h4>{t('update_electoral_process')}</h4></a>
                      <p>{t('update_electoral_process_description')}</p>
                    </div>
                    <div className="right-image">
                      <a href="#"><img src="/assets/images/blog-thumb-01.png" alt={t('update_electoral_process')} /></a>
                    </div>
                  </li>
                  <li>
                    <div className="left-content align-self-center">
                      <a href="#"><h4>{t('how_to_verify_registration')}</h4></a>
                      <p>{t('how_to_verify_registration_description')}</p>
                    </div>
                    <div className="right-image">
                      <a href="#"><img src="/assets/images/Vignette-Election-TPE-2024.jpg.webp" alt={t('how_to_verify_registration')} /></a>
                    </div>
                  </li>
                  <li>
                    <div className="left-content align-self-center">
                      <a href="#"><h4>{t('faq_e_voting')}</h4></a>
                      <p>{t('faq_e_voting_description')}</p>
                    </div>
                    <div className="right-image">
                      <a href="#"><img src="/assets/images/564.jpg" alt={t('faq_e_voting')} /></a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="contact" className="contact-us section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center wow fadeInLeft" data-wow-duration="0.5s" data-wow-delay="0.25s">
              <div className="section-heading">
                <h2>{t('voter_card_search_title')}</h2>
                <p>{t('voter_card_search_description')}</p>
                <div className="phone-info">
                  <h4>{t('all_requests')}<span><i className="fa fa-phone"></i> <a href="tel:+2610100200340">+261 010 020 0340</a></span></h4>
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInRight" data-wow-duration="0.5s" data-wow-delay="0.25s">
              <form id="contact" action="" method="post">
                <div className="row">
                  <div className="col-lg-6">
                    <fieldset>
                      <input type="text" name="name" id="name" placeholder={t('name_placeholder')} autoComplete="on" required />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input type="text" name="surname" id="surname" placeholder={t('surname_placeholder')} autoComplete="on" required />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <input type="email" name="email" id="email" pattern="[^ @]*@[^ @]*" placeholder={t('email_placeholder')} required="" />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <input name="message" type="text" className="form-control" id="message" placeholder={t('matricule_placeholder')} required=""></input>
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" id="form-submit" className="main-button ">{t('search_button')}</button>
                    </fieldset>
                  </div>
                </div>
                <div className="contact-dec">
                  <img src="/assets/images/contact-decoration.png" alt={t('voter_card_search_title')} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.25s">
              <p>{t('footer_text')}
              <br />{t('design_by')} <a rel="nofollow" href="">Rabearison Khevin</a></p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;