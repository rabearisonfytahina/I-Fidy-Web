import React from "react";

const Footer = ({ t }) => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 wow fadeIn">
            <p>{t("footer_text")}
            <br />{t("design_by")} <a rel="nofollow" href="">Rabearison Khevin</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
