import axios from "axios";
import { APP_URL } from "./constants";

const instance = axios.create({
  baseURL: `${APP_URL}/api/v1`, // API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (request) => {
    request.headers.Authorization = window.localStorage.getItem("token");
    return request;
  },
  (error) => {
    console.log(error);
    return Promise.resolve(error);
  }
);

instance.interceptors.response.use(
  (response) => { 
    localStorage.setItem("role", "User");
    return response;
  },
  (error) => { 
    if (error?.response?.status === 401) {
      localStorage.clear(); 
      window.location.href = "/login";
    }
    return Promise.resolve(error?.response);
  }
);

export default instance;
