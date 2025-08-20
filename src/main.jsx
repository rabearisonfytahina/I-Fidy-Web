// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router.jsx'; // On utilise maintenant Router.jsx
import { LanguageProvider } from './context/LanguageProvider.jsx';
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <Router />
    </LanguageProvider>
  </React.StrictMode>
);
