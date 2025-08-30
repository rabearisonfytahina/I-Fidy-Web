import api from '../api';

const ELECTEUR_ENDPOINT = 'electeurs/';

export const getElecteurs = (page = 1, filters = '') =>
  api.get(`${ELECTEUR_ENDPOINT}?page=${page}${filters}`);

export const getAllElecteurs = async (filters = '') => {
  let results = [], page = 1, hasNext = true;

  while (hasNext) {
    const data = await api.get(`${ELECTEUR_ENDPOINT}?page=${page}${filters}`);
    results = results.concat(data.results);
    hasNext = !!data.next;
    page++;
  }

  return results;
};

export const getElecteur = (id) => api.get(`${ELECTEUR_ENDPOINT}${parseInt(id)}/`);
export const createElecteur = (data) => api.post(ELECTEUR_ENDPOINT, data);
export const updateElecteur = (id, data) => api.put(`${ELECTEUR_ENDPOINT}${id}/`, data);
export const deleteElecteur = (id) => api.delete(`${ELECTEUR_ENDPOINT}${id}/`);

export const verifierElecteur = (data) =>
  api.post(`${ELECTEUR_ENDPOINT}verifier/`, data);
