import Axios, { AxiosRequestConfig } from "axios";
import { notify } from "../../../core/utils/notify";
import { commentAction } from "./comment";
import { SortOrder } from "../../../types/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../core/utils/constants";

export interface ApiQueryParams {
  id?: string;
  status?: string;
  search?: string;
  order?: SortOrder;
  sortBy?: string;
}

export function configureApi() {
  Axios.interceptors.response.use(
    (response) => {
      const status = response?.data?.status;
      const message = response?.data?.message;

      if (status === "success" && message) {
        notify.success(message);
      }

      if (status === "error") {
        if (!message) {
          notify.error(TRY_AGAIN_LATER_ERROR);
        } else {
          notify.error(message);
        }
      }

      return response?.data || response;
    },
    (error) => {
      if (error.response?.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        notify.error("Your session timed out. Please log in again");
        window.location.href = "/";
        return error.response?.data;
      }

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.data ||
        error.response?.statusText;

      if (process.env.NODE_ENV !== "production") {
        notify.error("Internal server error", errorMsg);
      }
      return error.response?.data;
    }
  );

  Axios.interceptors.request.use((config) => {
    return {
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
      maxRedirects: 0,
      ...config,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("session")}`
      }
    };
  });
}

const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> =>
  Axios.get(url, { ...config, params });
const post = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> =>
  Axios.post(url, params, config);
const put = (url: string, params: any) => Axios.put(url, params);
const patch = <T>(url: string, params: any): Promise<T> => Axios.patch(url, params);
const _delete = <T>(url: string, params?: any): Promise<T> =>
  Axios.delete(url, { params });

export default {
  get,
  post,
  put,
  patch,
  delete: _delete,
  comment: commentAction
};
