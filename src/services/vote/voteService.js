import api from "../api";

const VOTE_ENDPOINT = "votes/";

export const createVote = (data) => api.post(`${VOTE_ENDPOINT}voter/`, data);
