// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router.jsx';
import { LanguageProvider } from './context/LanguageProvider.jsx';

// CSS
import 'react-toastify/dist/ReactToastify.css';
import '../public/vendor/bootstrap/css/bootstrap.min.css';
import '../src/assets/css/fontawesome.css';
import '../src/assets/css/index.css';
import '../src/assets/css/animated.css';
import '../src/assets/css/owl.css';
import '../src/assets/css/header.css';


// JS (si nécessaire pour ton site, sinon tu peux intégrer certaines fonctions directement dans React)
// import '../src/assets/js/animation.js';
// import '../src/assets/js/imagesloaded.js';
// import '../src/assets/js/templatemo-custom.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <Router />
    </LanguageProvider>
  </React.StrictMode>
);
