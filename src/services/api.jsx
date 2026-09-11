import axios from "axios";
import { getCurrentUser } from "./getCurrentUser";


const servers = [
  "https://hany-rho.vercel.app/v1",
  
];



const user = getCurrentUser();

const role = user?.role;

const isAdmin =
  role === "superadmin" ||
  role === "admin";

let currentServer = isAdmin
  ? 0
  : Math.floor(Math.random() * servers.length);
let retryCount = 0;
const MAX_RETRY = 3;

export const api = axios.create({
  baseURL: servers[currentServer],
  withCredentials: true,

});


/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.baseURL = servers[currentServer];

  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response) => {
    retryCount = 0; // reset عند النجاح
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    const shouldSwitch =
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.response?.status >= 500;

    if (shouldSwitch) {
      retryCount++;

      if (retryCount <= MAX_RETRY) {
        // لف على السيرفرات بشكل دائري
        currentServer = (currentServer + 1) % servers.length;

        console.log(
          `Retry ${retryCount} → switching to: ${servers[currentServer]}`
        );

        originalRequest.baseURL = servers[currentServer];

        return api(originalRequest);
      }

      // لو خلصنا 3 محاولات
      retryCount = 0;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;