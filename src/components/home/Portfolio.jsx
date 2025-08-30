import React from "react";

const Portfolio = ({ t }) => {
  return (
    <div id="portfolio" className="our-portfolio section">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="section-heading wow bounceIn" data-wow-duration="1s" data-wow-delay="0.2s">
              <h2>{t("discover_candidates_title")}</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {[1, 2, 3].map((num, i) => (
            <div className="col-lg-4 col-sm-4" key={i}>
              <a href="#">
                <div className="item wow bounceInUp" data-wow-duration="1s" data-wow-delay={`${0.3 + i * 0.1}s`}>
                  <div className="hidden-content">
                    <p>{t(`candidate_description${num > 1 ? num : ""}`)}</p>
                  </div>
                  <div className="showed-content">
                    <img src="/assets/images/portfolio-image.png" alt={`${t("candidate")} ${num}`} />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
