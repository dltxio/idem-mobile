import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance
} from "axios";
import appConfig from "../appConfigfig";
import { Buffer } from "buffer";

export default class HTTPClient {
  private client: AxiosInstance;
  private customOnError!: (e: string) => void | undefined;

  constructor(baseUrl: string, secure: boolean) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Cache-Control": "no-store"
      }
    });

    if (secure) {
      this.client.interceptors.request.use(
        async (config) => {
          const basicAuth = Buffer.from(
            appConfig.userName + ":" + appConfig.password
          ).toString("base64");
          if (basicAuth && config.headers)
            config.headers.Authorization = `Basic ${basicAuth}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  }

  protected get = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.client
      .get(url, axiosReqConfig)
      .then(this.onSuccess)
      .catch(this.onError) as unknown as Promise<T>;
  protected post = <T>(
    url: string,
    data?: unknown,
    reqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.client
      .post(url, data, reqConfig)
      .then(this.onSuccess)
      .catch(this.onError) as unknown as Promise<T>;
  protected put = <T>(
    url: string,
    data?: unknown,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.client
      .put(url, data, axiosReqConfig)
      .then(this.onSuccess)
      .catch(this.onError) as unknown as Promise<T>;
  public setCustomOnError = (onError: (e: string) => void) => {
    this.customOnError = onError;
  };

  private onSuccess = (res: AxiosResponse) => res.data;
  private onError = (e: AxiosError) => {
    const error = e.response ? e.response.data : e;

    if (this.customOnError) {
      this.customOnError(error as string);
    }

    throw error;
  };
}
