import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import React from "react";
import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

// Fallback action creator to avoid path alias issues
const setTokenAction = (token: string) => ({
  type: "auth/setToken",
  payload: token,
});

interface FailedQueueItem {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}

export const useHttp = () => {
  const dispatch = useDispatch();
  const isRefreshing = useRef<boolean>(false);
  const failedQueue = useRef<FailedQueueItem[]>([]);

  React.useEffect(() => {
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
  }, []);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const processQueue = (queueError?: unknown, token?: string): void => {
    failedQueue.current.forEach(({ resolve, reject }) => {
      if (queueError || !token) {
        reject(queueError ?? new Error("Token refresh failed"));
      } else {
        resolve(token);
      }
    });

    failedQueue.current = [];
  };

  const refresh = useCallback(async (): Promise<string> => {
    if (isRefreshing.current) {
      // If already refreshing, return a promise that will resolve when refresh completes
      return new Promise<string>((resolve, reject) => {
        failedQueue.current.push({ resolve, reject });
      });
    }

    isRefreshing.current = true;

    try {
      const currentToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!currentToken) {
        throw new Error("No token available for refresh");
      }

      const response: AxiosResponse<{ token: string }> = await axios.post(
        "/auth/refresh-token",
        {
          token: currentToken,
        }
      );

      const newToken = response.data.token;

      if (!newToken) {
        throw new Error("No new token received from refresh");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
      }
      dispatch(setTokenAction(newToken));
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      processQueue(undefined, newToken);

      return newToken;
    } catch (err) {
      console.error("Token refresh failed:", err);

      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      delete axios.defaults.headers.common["Authorization"];

      processQueue(err);
      throw err;
    } finally {
      isRefreshing.current = false;
    }
  }, [dispatch]);

  type RequestFn<T> = () => Promise<AxiosResponse<T>>;

  const makeRequest = useCallback(
    async <T>(requestFn: RequestFn<T>, retryCount = 0): Promise<T> => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const response = await requestFn();
        return response.data;
      } catch (err: unknown) {
        const status = (err as any)?.response?.status as number | undefined;
        // Only retry once for 401/402 errors
        if ((status === 401 || status === 402) && retryCount === 0) {
          try {
            await refresh();
            // Retry the original request with new token
            return await makeRequest<T>(requestFn, retryCount + 1);
          } catch (refreshError) {
            console.error("Token refresh failed, redirecting to login");
            if (typeof window !== "undefined") {
              window.location.href = "/auth?mode=signin";
            }
            throw refreshError;
          }
        }

        throw err;
      }
    },
    [refresh]
  );

  const get = useCallback(
    async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await makeRequest<T>(() => axios.get<T>(url, config));
        console.log(result);
        return result;
      } catch (err: unknown) {
        console.error("GET request failed:", err);
        const errorMessage = (err as Error).message || "Request failed";
        setError(errorMessage);
        toast.error("Request Failed", {
          description: errorMessage,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  const post = useCallback(
    async <T, D = unknown>(
      url: string,
      data: D,
      config: AxiosRequestConfig = {}
    ): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await makeRequest<T>(() =>
          axios.post<T>(url, data, config)
        );

        // Show success toast for POST requests
        toast.success("Success", {
          description: "Request completed successfully",
        });
        console.log(result);
        return result;
      } catch (err: any) {
        console.error("POST request failed:", err);
        const errorMessage = (err as Error).message || "Request failed";
        setError(errorMessage);
        console.log(err?.response?.data?.message);
        toast.error("Request Failed", {
          description: err?.response?.data?.message || errorMessage,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  const put = useCallback(
    async <T, D = unknown>(
      url: string,
      data: D,
      config: AxiosRequestConfig = {}
    ): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await makeRequest<T>(() =>
          axios.put<T>(url, data, config)
        );

        // Show success toast for PUT requests
        toast.success("Updated", {
          description: "Changes saved successfully",
        });
        console.log(result);
        return result;
      } catch (err: any) {
        console.error("PUT request failed:", err);
        const errorMessage = (err as Error).message || "Request failed";
        setError(errorMessage);
        console.log(err?.response?.data?.message);
        toast.error("Update Failed", {
          description: err?.response?.data?.message || errorMessage,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  const del = useCallback(
    async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await makeRequest<T>(() => axios.delete<T>(url, config));

        // Show success toast for DELETE requests
        toast.success("Deleted", {
          description: "Item deleted successfully",
        });
        console.log(result);
        return result;
      } catch (err: unknown) {
        console.error("DELETE request failed:", err);
        const errorMessage = (err as Error).message || "Request failed";
        setError(errorMessage);
        toast.error("Delete Failed", {
          description: errorMessage,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  return {
    get,
    post,
    put,
    del,
    isLoading,
    error,
    setError,
    setIsLoading,
  };
};
