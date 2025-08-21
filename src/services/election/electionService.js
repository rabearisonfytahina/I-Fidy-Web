import api from '../api';

const ELECTION_ENDPOINT = 'elections/elections/';

export const getElections = (page = 1) => api.get(`${ELECTION_ENDPOINT}?page=${page}`);

export const getAllElections = async () => {
  let results = [], page = 1, hasNext = true;

  while (hasNext) {
    const data = await api.get(`${ELECTION_ENDPOINT}?page=${page}`);
    results = results.concat(data.results);
    hasNext = !!data.next;
    page++;
  }

  return results;
};

export const getElection = (id) => api.get(`${ELECTION_ENDPOINT}${id}/`);
export const createElection = (data) => api.post(ELECTION_ENDPOINT, data);
export const updateElection = (id, data) => api.put(`${ELECTION_ENDPOINT}${id}/`, data);
export const deleteElection = (id) => api.delete(`${ELECTION_ENDPOINT}${id}/`);
// Mettre à jour changeElectionStatus pour accepter le seul `status` :
export const changeElectionStatus = (id, status) => api.post(`elections/elections/${id}/changer_statut/`, { status });

