import React from "react";

const About = ({ t }) => {
  return (
    <div id="about" className="about-us section">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="left-image wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
              <img src="/assets/images/about-left-image.png" alt={t("security_features_title")} />
            </div>
          </div>
          <div className="col-lg-8 align-self-center">
            <div className="services">
              <div className="row">
                {[
                  { img: "service-icon-01.png", title: t("enhanced_security"), text: t("strong_authentication") },
                  { img: "service-icon-02.png", title: t("full_accessibility"), text: t("vote_easily") },
                  { img: "service-icon-03.png", title: t("transparency"), text: t("real_time_monitoring") },
                  { img: "service-icon-04.png", title: t("dedicated_support"), text: t("assistance_information") },
                ].map((service, i) => (
                  <div className="col-lg-6" key={i}>
                    <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay={`${0.5 + i * 0.2}s`}>
                      <div className="icon">
                        <img src={`/assets/images/${service.img}`} alt={service.title} />
                      </div>
                      <div className="right-text">
                        <h4>{service.title}</h4>
                        <p>{service.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
