import api from '../api';

const ELECTEUR_AUTH_ENDPOINT = 'auth-electeur/'; // adapter selon ton endpoint Django

// Étape 1 : Vérification des identifiants
export const verifyIdentifiants = (data) => api.post(`${ELECTEUR_AUTH_ENDPOINT}start/`, data);

// Étape 2 : Envoi de l'image pour la reconnaissance faciale
export const verifyFacial = (data) => api.post(`${ELECTEUR_AUTH_ENDPOINT}face/`, data);

// Étape 3 : Vérification OTP
export const verifyOtp = (data) => api.post(`${ELECTEUR_AUTH_ENDPOINT}verify-otp/`, data);

export const deleteSession = (id) => api.delete(`${ELECTEUR_AUTH_ENDPOINT}delete/${id}/`);

