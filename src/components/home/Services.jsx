import React from "react";

const Services = ({ t }) => {
  return (
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
  );
};

export default Services;
