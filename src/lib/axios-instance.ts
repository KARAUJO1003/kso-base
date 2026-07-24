import { toast } from "sonner";
import { parseCookies, setCookie } from "nookies";
import { clearCacheNavegador } from "./session/utils";
import {
  sessionConfig,
  sessionCookieNames,
  getFirstCookieValue,
} from "@/config/session-config";
import axios, { InternalAxiosRequestConfig } from "axios";
import { httpErrorMessages } from "@/lib/messages";

const publicBaseURL =
  process.env.APP_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_PROD_API_BASE_URL;

const baseURL =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_BASE_URL || publicBaseURL
    : publicBaseURL;

function getAuthToken() {
  const cookies = parseCookies();
  return getFirstCookieValue(cookies, sessionCookieNames.token);
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();

    if (token) {
      config.headers["x-access-token"] = token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = "application/json";
    config.timeout = 20000;

    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);

    return Promise.reject(error);
  },
);

let isRefreshing = false;
let isEndingSession = false;
let failedRequestsQueue: any[] = [];

function rejectFailedRequests(error: any) {
  failedRequestsQueue.forEach((req) => req.onFailure(error));
  failedRequestsQueue = [];
  isRefreshing = false;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

function endInvalidSession(error?: any) {
  if (isEndingSession) return false;

  isEndingSession = true;
  rejectFailedRequests(error);
  clearCacheNavegador(false);
  redirectToLogin();
  return true;
}

function isRefreshRequest(config: any) {
  return String(config?.url || "").includes("/auth/refresh");
}

function getAuthErrorTitle(error: any) {
  return error?.response?.data?.title || error?.title || httpErrorMessages.sessionExpiredTitle;
}

function getAuthErrorDescription(error: any) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    httpErrorMessages.sessionExpiredDescription
  );
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401: {
          const cookies = parseCookies();
          const refreshToken = getFirstCookieValue(
            cookies,
            sessionCookieNames.refreshToken,
          );

          if (error.config?._retry || isRefreshRequest(error.config)) {
            if (endInvalidSession(error)) {
              toast.error(getAuthErrorTitle(error), {
                description: getAuthErrorDescription(error),
              });
            }
            return Promise.reject(error);
          }

          if (!refreshToken) {
            if (endInvalidSession(error)) {
              toast.error(getAuthErrorTitle(error), {
                description: getAuthErrorDescription(error),
              });
            }
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({
                onSuccess: (token: string) => {
                  error.config._retry = true;
                  error.config.headers.Authorization = `Bearer ${token}`;
                  error.config.headers["x-access-token"] = token;
                  resolve(axiosInstance(error.config));
                },
                onFailure: reject,
              });
            });
          }

          if (refreshToken && !isRefreshing) {
            isRefreshing = true;
            error.config._retry = true;

            return axiosInstance
              .post("/auth/refresh", { refreshToken })
              .then(async (res) => {
                const { token, refreshToken: newRefreshToken } = res.data || {};

                if (!token || !newRefreshToken) {
                  throw new Error("Resposta de refresh token inválida.");
                }

                setCookie(null, sessionConfig.TOKEN_NAME, token, { path: "/" });
                setCookie(
                  null,
                  sessionConfig.REFRESH_TOKEN_NAME,
                  newRefreshToken,
                  { path: "/" },
                );

                axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
                axiosInstance.defaults.headers["x-access-token"] = token;

                failedRequestsQueue.forEach((req) => req.onSuccess(token));
                failedRequestsQueue = [];
                isRefreshing = false;
                isEndingSession = false;

                error.config.headers.Authorization = `Bearer ${token}`;
                error.config.headers["x-access-token"] = token;
                return axiosInstance(error.config);
              })
              .catch((err) => {
                if (endInvalidSession(err)) {
                  toast.error(getAuthErrorTitle(err), {
                    description: getAuthErrorDescription(err),
                  });
                }
                return Promise.reject(err);
              });
          }
          break;
        }
        case 403:
        case 404:
          toast.error(error?.response?.data?.title || error?.title, {
            description: error?.response?.data?.message || error?.message,
          });
          break;
        case 500:
          toast.error(httpErrorMessages.serverError);
          break;
        default:
          toast.error(httpErrorMessages.unknownError, {
            description: error?.response?.data?.message || error?.message,
          });
      }
    } else if (error.code) {
      switch (error.code) {
        case "ERR_CANCELED":
          toast.error(httpErrorMessages.requestCanceled, {
            description: httpErrorMessages.requestCanceledDescription,
          });
          break;
        default:
          toast.error(httpErrorMessages.networkError, {
            description: httpErrorMessages.networkErrorDescription,
          });
      }
    } else {
      toast.error(httpErrorMessages.requestSetupError, {
        description: httpErrorMessages.requestSetupErrorDescription,
      });
    }
    return Promise.reject(error);
  },
);

export type ApiListResponse<T> = {
  data: T[];
  total: number;
};

export const api = axiosInstance;
export const rawApi = axiosInstance;
export { baseURL };
