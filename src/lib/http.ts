
import {
  AxiosError,
  type AxiosProgressEvent,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { api } from "./api";

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface RequestOptions {
  accessToken?: string;
  contentType?: string;
  responseType?: AxiosRequestConfig["responseType"];
  onUploadProgress?: (event: AxiosProgressEvent) => void;
  config?: AxiosRequestConfig;
}

function getDefaultMessage(status?: number): string {
  switch (status) {
    case 400:
      return "Invalid request.";

    case 401:
      return "Unauthorized. Please log in again.";

    case 403:
      return "You do not have permission to perform this action.";

    case 404:
      return "Requested resource not found.";

    case 409:
      return "This resource already exists.";

    case 422:
      return "Validation failed.";

    case 429:
      return "Too many requests. Please try again later.";

    default:
      return status && status >= 500
        ? "Server error. Please try again later."
        : "Something went wrong.";
  }
}

function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const responseData: unknown = error.response?.data;

    if (!error.response) {
      return {
        message: error.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Network error. Please check your internet connection.",
      };
    }

    let message: string | undefined;
    let errors: Record<string, string[]> | undefined;

    if (
      typeof responseData === "object" &&
      responseData !== null
    ) {
      const data = responseData as {
        message?: unknown;
        error?: unknown;
        errors?: unknown;
      };

      if (typeof data.message === "string") {
        message = data.message;
      } else if (typeof data.error === "string") {
        message = data.error;
      }

      if (
        typeof data.errors === "object" &&
        data.errors !== null &&
        !Array.isArray(data.errors)
      ) {
        errors = data.errors as Record<string, string[]>;
      }
    }

    return {
      message: message || getDefaultMessage(status),
      status,
      errors,
    };
  }

  return {
    message:
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.",
  };
}

function buildConfig(
  options: RequestOptions = {}
): AxiosRequestConfig {
  const headers = {
    Accept: "application/json",
    ...options.config?.headers,
  };

  if (options.accessToken) {
    Object.assign(headers, {
      Authorization: options.accessToken,
    });
  }

  if (options.contentType) {
    Object.assign(headers, {
      "Content-Type": options.contentType,
    });
  }

  return {
    ...options.config,
    headers,
    ...(options.responseType
      ? { responseType: options.responseType }
      : {}),
    ...(options.onUploadProgress
      ? { onUploadProgress: options.onUploadProgress }
      : {}),
  };
}

async function request<T>(
  promise: Promise<AxiosResponse<T>>,
  message?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await promise;

    return {
      status: true,
      data: response.data,
      error: null,
    };
  } catch (error: unknown) {
    if(message && handleApiError(error)?.message){
      message?.error?.(handleApiError(error)?.message)
    }
    return {
      status: false,
      data: null,
      error: handleApiError(error),
    };
  }
}

export const http = {
  get: <T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> =>
    request<T>(
      api.get<T>(url, buildConfig(options))
    ),

  post: <T, B = unknown>(
    url: string,
    body: B,
    options?: RequestOptions,
    message?: any
  ): Promise<ApiResponse<T>> =>
    request<T>(
      api.post<T>(url, body, buildConfig(options)),
      message
    ),

  put: <T, B = unknown>(
    url: string,
    body: B,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> =>
    request<T>(
      api.put<T>(url, body, buildConfig(options))
    ),

  patch: <T, B = unknown>(
    url: string,
    body: B,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> =>
    request<T>(
      api.patch<T>(url, body, buildConfig(options))
    ),

  delete: <T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> =>
    request<T>(
      api.delete<T>(url, buildConfig(options))
    ),
};
