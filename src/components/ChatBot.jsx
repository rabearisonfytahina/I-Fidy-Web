import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageProvider.jsx";
import "../assets/css/chatbot.css";

export default function ChatBot() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Définir les questions/réponses dynamiquement selon la langue
  const getQuestions = () => [
    { question: t("chatbot_how_to_vote_question"), answer: t("chatbot_how_to_vote_answer") },
    { question: t("chatbot_check_card_question"), answer: t("chatbot_check_card_answer") },
    { question: t("chatbot_vote_security_question"), answer: t("chatbot_vote_security_answer") },
    { question: t("chatbot_contact_support_question"), answer: t("chatbot_contact_support_answer") }
  ];

  const [questions, setQuestions] = useState(getQuestions());

  // Mettre à jour les questions quand la langue change
  useEffect(() => {
    setQuestions(getQuestions());
    // Mettre à jour aussi le message de bienvenue si le chat est ouvert
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", text: t("chatbot_welcome") }]);
    }
  }, [language]);

  const toggleChat = () => {
    setOpen(!open);
    if (!open && messages.length === 0) {
      setMessages([{ from: "bot", text: t("chatbot_welcome") }]);
    }
  };

  const handleClickQuestion = (q) => {
    setMessages(prev => [...prev, { from: "user", text: q.question }]);
    setTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: q.answer }]);
      setTyping(false);
    }, 800 + q.answer.length * 20);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <>
      <div className="chatbot-button" onClick={toggleChat}>💬</div>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-left">
              <span className="bot-status"></span>
              <span>{t("chatbot_title")}</span>
            </div>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.from}`}>
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className="chatbot-message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}

            <div ref={messagesEndRef} />

            {!typing && messages.length > 0 && (
              <div className="chatbot-questions">
                {questions.map((q, i) => (
                  <button key={i} onClick={() => handleClickQuestion(q)}>
                    {q.question}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
