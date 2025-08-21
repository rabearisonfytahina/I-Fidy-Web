const BASE_URL = 'http://localhost:8000/api/';


const api = {
  get: async (endpoint) => {
    const res = await fetch(BASE_URL + endpoint);
    if (!res.ok) throw new Error(`GET ${endpoint} failed`);
    
    return res.json();
  },

  post: async (endpoint, data) => {
    const isFormData = data instanceof FormData;
    const token = localStorage.getItem("access_token");

    const res = await fetch(BASE_URL + endpoint, {
      method: 'POST',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
    const token = localStorage.getItem("access_token");

    const res = await fetch(BASE_URL + endpoint, {
      method: 'PUT',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
    const token = localStorage.getItem("access_token");
    const res = await fetch(BASE_URL + endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed`);
    return res.ok;
  }
};

export default api;



