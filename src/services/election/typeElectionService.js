import api from '../api';

const TYPE_ELECTION_ENDPOINT = 'elections/type-elections/';

export const getTypeElections = (page = 1) => api.get(`${TYPE_ELECTION_ENDPOINT}?page=${page}`);

export const getAllTypeElections = async () => {
  let results = [], page = 1, hasNext = true;

  while (hasNext) {
    const data = await api.get(`${TYPE_ELECTION_ENDPOINT}?page=${page}`);
    results = results.concat(data.results);
    hasNext = !!data.next;
    page++;
  }

  return results;
};

export const getTypeElection = (id) => api.get(`${TYPE_ELECTION_ENDPOINT}${id}/`);
export const createTypeElection = (data) => api.post(TYPE_ELECTION_ENDPOINT, data);
export const updateTypeElection = (id, data) => api.put(`${TYPE_ELECTION_ENDPOINT}${id}/`, data);
export const deleteTypeElection = (id) => api.delete(`${TYPE_ELECTION_ENDPOINT}${id}/`);
