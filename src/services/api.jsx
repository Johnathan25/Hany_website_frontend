import axios from "axios";

const SERVERS = [
  "https://hany-rho.vercel.app/v1",
];

let currentServer = 0;

export const api = axios.create({
  baseURL: SERVERS[currentServer],
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {
    // Always use the current server
    config.baseURL = SERVERS[currentServer];

    const token = localStorage.getItem("token");
    const financialToken = localStorage.getItem("financialToken");

    // Add normal authentication token
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If your backend expects financialToken separately
    if (financialToken) {
      config.headers = config.headers || {};
      config.headers["X-Financial-Token"] = financialToken;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  // Successful response
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Make sure config exists
    if (!originalRequest) {
      return Promise.reject(error);
    }

    /* ==========================
       Server Failover
    ========================== */

    if (
      !originalRequest._serverRetry &&
      (
        !error.response ||
        error.code === "ECONNABORTED" ||
        error.response?.status >= 500
      )
    ) {
      originalRequest._serverRetry = true;

      currentServer = (currentServer + 1) % SERVERS.length;

      api.defaults.baseURL = SERVERS[currentServer];
      originalRequest.baseURL = SERVERS[currentServer];

      return api(originalRequest);
    }

    /* ==========================
       Refresh Token
    ========================== */

    const token = localStorage.getItem("token");

    /*
      IMPORTANT:
      If there is NO token, this is probably a public request.

      Example:
      GET /notification
      GET /about
      GET /services

      We should NOT redirect the user to /login.
    */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      token
    ) {
      originalRequest._retry = true;

      try {
        let refreshRes;

        /* ==========================
           Try Refresh on Current Server
        ========================== */

        try {
          refreshRes = await axios.post(
            `${SERVERS[currentServer]}/users/refresh-token`,
            {},
            {
              withCredentials: true,
            }
          );
        } catch (refreshError) {
          /* ==========================
             Refresh Server Failed
          ========================== */

          if (
            !refreshError.response ||
            refreshError.code === "ECONNABORTED" ||
            refreshError.response?.status >= 500
          ) {
            currentServer =
              (currentServer + 1) % SERVERS.length;

            api.defaults.baseURL = SERVERS[currentServer];

            refreshRes = await axios.post(
              `${SERVERS[currentServer]}/users/refresh-token`,
              {},
              {
                withCredentials: true,
              }
            );
          } else {
            throw refreshError;
          }
        }

        /* ==========================
           Save New Access Token
        ========================== */

        const newToken = refreshRes.data.accessToken;

        if (!newToken) {
          throw new Error("No access token returned from refresh");
        }

        localStorage.setItem("token", newToken);

        /* ==========================
           Retry Original Request
        ========================== */

        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        originalRequest.baseURL =
          SERVERS[currentServer];

        return api(originalRequest);

      } catch (refreshError) {
        /*
          Token is invalid/expired and refresh failed.
          Now redirect to login.
        */

        localStorage.removeItem("token");

        // Optional cleanup
        localStorage.removeItem("userName");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    /*
      If there is no token, simply return the error.
      DO NOT redirect to login.
    */

    return Promise.reject(error);
  }
);

export default api;