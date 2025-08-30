// src/services/vote/voteService.js
import api from "../api";

const VOTE_ENDPOINT = "votes/";

export const createVote = (data) => api.post(`${VOTE_ENDPOINT}voter/`, data);

// optionnel si tu veux récupérer
export const getVotes = () => api.get(`${VOTE_ENDPOINT}`);

export const checkIfVoted = (electionId, authId) =>
  api.get(`${VOTE_ENDPOINT}check/${electionId}/${authId}/`);
