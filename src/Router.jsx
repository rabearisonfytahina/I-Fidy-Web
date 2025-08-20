// src/Router.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Aide from './pages/Aide.jsx';
import Vote from './pages/Vote.jsx';


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/aide" element={<Aide />} />
        <Route path="/vote" element={<Vote />} />

      </Routes>
    </BrowserRouter>
  );
}
