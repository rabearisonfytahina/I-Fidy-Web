import React from "react";

const Blog = ({ t }) => {
  return (
    <div id="blog" className="our-blog section">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 wow fadeInDown">
            <div className="section-heading">
              <h2>{t("news_information_title")}</h2>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInDown">
            <div className="top-dec">
              <img src="/assets/images/blog-dec.png" alt={t("news_information_title")} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 wow fadeInUp">
            <div className="left-image">
              <a href="#"><img src="/assets/images/big-blog-thumb.jpg" alt={t("election_news_image_alt")} /></a>
              <div className="info">
                <div className="inner-content">
                  <ul>
                    <li><i className="fa fa-users"></i> {t("news_author")}</li>
                    <li><i className="fa fa-folder"></i> {t("news_category")}</li>
                  </ul>
                  <a href="#"><h4>{t("secure_e_voting_article_title")}</h4></a>
                  <p>{t("secure_e_voting_article_description")}</p>
                  <div className="main-blue-button">
                    <a href="#">{t("learn_more")}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp">
            <div className="right-list">
              <ul>
                {[
                  { title: t("update_electoral_process"), desc: t("update_electoral_process_description"), img: "blog-thumb-01.png" },
                  { title: t("how_to_verify_registration"), desc: t("how_to_verify_registration_description"), img: "Vignette-Election-TPE-2024.jpg.webp" },
                  { title: t("faq_e_voting"), desc: t("faq_e_voting_description"), img: "564.jpg" },
                ].map((item, i) => (
                  <li key={i}>
                    <div className="left-content align-self-center">
                      <a href="#"><h4>{item.title}</h4></a>
                      <p>{item.desc}</p>
                    </div>
                    <div className="right-image">
                      <a href="#"><img src={`/assets/images/${item.img}`} alt={item.title} /></a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
