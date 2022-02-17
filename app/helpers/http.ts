import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const get = <T>(
  url: string,
  axiosReqConfig?: AxiosRequestConfig,
): Promise<T> => axios.get(url, axiosReqConfig).then(onSuccess).catch(onError);

export const post = <T>(
  url: string,
  data?: unknown,
  reqConfig?: AxiosRequestConfig,
): Promise<T> =>
  axios.post(url, data, reqConfig).then(onSuccess).catch(onError);

export const put = <T>(
  url: string,
  data?: unknown,
  axiosReqConfig?: AxiosRequestConfig,
): Promise<T> =>
  axios.put(url, data, axiosReqConfig).then(onSuccess).catch(onError);

const onSuccess = (res: AxiosResponse) => res.data;
const onError = (e: AxiosError) => {
  throw e.response ? e.response.data : e;
};
