const BASE_URL = 'http://localhost:8000/api/';

const api = {
  get: async (endpoint) => {
    const res = await fetch(BASE_URL + endpoint);
    if (!res.ok) throw new Error(`GET ${endpoint} failed`);
    
    return res.json();
  },

  post: async (endpoint, data) => {
    const isFormData = data instanceof FormData;

    const res = await fetch(BASE_URL + endpoint, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();  // Pour voir les erreurs du backend
      console.error("Erreur du backend :", err);
      throw new Error(`POST ${endpoint} failed`);
    }

    return res.json();
  },


  put: async (endpoint, data) => {
    const isFormData = data instanceof FormData;

    const res = await fetch(BASE_URL + endpoint, {
      method: 'PUT',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Erreur du backend :", err);
      throw new Error(`PUT ${endpoint} failed`);
    }

    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed`);
    return res.ok;
  }
};

export default api;
