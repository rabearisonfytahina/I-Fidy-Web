import api from '../api';

const CANDIDAT_ENDPOINT = 'elections/candidats/';

export const getCandidats = (page = 1) => api.get(`${CANDIDAT_ENDPOINT}?page=${page}`);

export const getAllCandidats = async () => {
  let results = [], page = 1, hasNext = true;

  while (hasNext) {
    const data = await api.get(`${CANDIDAT_ENDPOINT}?page=${page}`);
    results = results.concat(data.results);
    hasNext = !!data.next;
    page++;
  }

  return results;
};

export const getCandidat = (id) => api.get(`${CANDIDAT_ENDPOINT}${id}/`);
export const createCandidat = (data) => api.post(CANDIDAT_ENDPOINT, data);
export const updateCandidat = (id, data) => api.put(`${CANDIDAT_ENDPOINT}${id}/`, data);
export const deleteCandidat = (id) => api.delete(`${CANDIDAT_ENDPOINT}${id}/`);
