import api from '../api';

const AUTH_ENDPOINT = "electeurs/auth/";

export const lookupElecteur = (data) => 
  api.post(`${AUTH_ENDPOINT}lookup/`, data);

export const faceVerifyElecteur = (formData) => 
  api.post(`${AUTH_ENDPOINT}face-verify/`, formData);

export const getMe = () => 
  api.get("electeurs/me/");

export const logoutElecteur = () => 
  api.post("electeurs/auth/logout/");
