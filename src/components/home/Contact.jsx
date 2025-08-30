import React, { useState } from "react";
import { verifierElecteur } from "../../services/electeur/electeurService.js";
// import { verifierElecteur } from "../../services/electeurs/electeurService";

const Contact = ({ t }) => {
  const [formData, setFormData] = useState({ name: "", surname: "", numCIN: "" });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifierElecteur({
        nom_electeur: formData.name,
        prenom_electeur: formData.surname,
        numCIN: formData.numCIN,
      });
      setResult(response);
    } catch (error) {
      setResult({ message: "Erreur de connexion au serveur", present: false });
    }
  };

  const closeModal = () => setResult(null);

  return (
    <>
      {/* Section normale */}
      <div id="contact" className={`contact-us section ${result ? "blur-sm" : ""}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center wow fadeInLeft">
              <div className="section-heading">
                <h2>{t("voter_card_search_title")}</h2>
                <p>{t("voter_card_search_description")}</p>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInRight">
              <form id="contact" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("name_placeholder")}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder={t("surname_placeholder")}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <input
                        type="text"
                        name="numCIN"
                        value={formData.numCIN}
                        onChange={handleChange}
                        placeholder={t("numCIN_placeholder")}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" className="main-button">
                        {t("search_button")}
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal centré */}
      {result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md text-center">
            <h3 className="text-lg font-bold mb-4">Résultat de la vérification</h3>
            <p className="mb-4">{result.message}</p>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
