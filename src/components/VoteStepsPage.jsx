// src/components/VoteStepsPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import confetti from "canvas-confetti";
import { useLanguage } from "../context/LanguageProvider.jsx"; // ✅ Ajouter ceci
import "../../public/assets/css/VoteStepsPage.css";
import NextVotePage from "../components/NextVotePage";

// Enlève le texte brut pour le traduire via "t"
const VoteStepsPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showNextPage, setShowNextPage] = useState(false);
  const [slideOut, setSlideOut] = useState(false);

  const { t } = useLanguage(); // ✅ Hook de langue

  const steps = [
    { text: t("step1"), icon: "bi-check2-square" },
    { text: t("step2"), icon: "bi-person-badge" },
    { text: t("step3"), icon: "bi-person-video3" },
    { text: t("step4"), icon: "bi-box-arrow-in-right" },
    { text: t("step5"), icon: "bi-shield-check" },
    { text: t("step6"), icon: "bi-award-fill" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep === steps.length - 1) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSlideOut(true);
      setTimeout(() => setShowNextPage(true), 600);
    }
  };

  if (showNextPage) return <NextVotePage />;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card
            className={`p-4 border-0 shadow-lg rounded-4 bg-light animate__animated ${
              slideOut ? "slide-left-out" : "animate__fadeInUp"
            }`}
            style={{ marginTop: "100px" }}
          >
            <Card.Body>
              <Card.Title className="text-center mb-5">
                <h2 className="fw-bold text-primary">🗳️ {t("title")}</h2>
              </Card.Title>

              <div className="stepper-container">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`step-item ${
                        index < currentStep ? "completed" : ""
                      } ${index === currentStep ? "active" : ""}`}
                    >
                      <div
                        className={`step-icon position-relative ${
                          index === steps.length - 1 &&
                          currentStep === steps.length - 1
                            ? "confetti"
                            : ""
                        }`}
                      >
                        <i className={`bi ${step.icon}`}></i>
                        <span className="step-number">{index + 1}</span>
                      </div>
                      <div className="step-label">{step.text}</div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`step-link ${
                          index < currentStep ? "connected" : ""
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* ✅ Bloc fixe en bas à droite */}
              <div className="floating-nav-bottom-right">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm me-2"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))}
                >
                  <i className="bi bi-arrow-left me-1"></i> {t("previous")}
                </button>
                
                <button
                  className="btn btn-primary btn-sm rounded-pill shadow-sm"
                  onClick={handleNext}
                >
                  {t("next")} <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VoteStepsPage;
