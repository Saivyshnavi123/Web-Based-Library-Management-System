import axios from "axios";

export const API_BASE_URL = "https://web-based-library-management-system.onrender.com/";
//export const API_BASE_URL = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiGet = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const apiPost = async (url, data, config = {}) => {
  try {
    let headers = config.headers || {};

    if (data instanceof FormData) {
      headers = { ...headers };
      delete headers["Content-Type"];
    } else {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }

    const response = await api.post(url, data, { ...config, headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const apiPut = async (url, data, config = {}) => {
  try {
    let headers = config.headers || {};

    if (data instanceof FormData) {
      headers = { ...headers };
      delete headers["Content-Type"];
    } else {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }

    const response = await api.put(url, data, { ...config, headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const apiDelete = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const apiPatch = async (url, data, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};