import React from "react";

const Banner = ({ t }) => {
  return (
    <div className="main-banner wow fadeIn" id="top" data-wow-duration="1s" data-wow-delay="0.5s">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-6 align-self-center">
                <div className="left-content header-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="1s">
                  <h6>{t("welcome_title")}</h6>
                  <h2>{t("platform_subtitle")}</h2>
                  <p>{t("platform_description")}</p>


                  <button className="btn btn-primary">{t("download_app")}</button>

                </div>
              </div>
              <div className="col-lg-6">
                <div className="right-image wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                  <img src="/assets/images/banner-right-image.png.png" className="photo" alt={t("secure_elections_image_alt")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
