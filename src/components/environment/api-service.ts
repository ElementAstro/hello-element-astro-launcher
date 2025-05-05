// Base API Service
// Provides basic HTTP request methods and error handling

// Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// Error handling function
const handleApiError = (
  error: unknown,
  message: string = "API request failed"
) => {
  console.error(message, error);

  if (error instanceof Response) {
    return error.json().then((err) => {
      throw new Error(err.message || message);
    });
  }

  throw error instanceof Error ? error : new Error(message);
};

// Request headers setup
const getDefaultHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add auth token if available
  const authToken = localStorage.getItem("auth_token");
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
};

// API Service class
export class ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // GET request
  protected async get<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    try {
      let url = `${this.baseUrl}${endpoint}`;

      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value);
          }
        });
        url += `?${searchParams.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response, `GET request failed: ${endpoint}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      return handleApiError(error, `GET request error: ${endpoint}`);
    }
  }

  // POST request
  protected async post<T, R = unknown>(endpoint: string, data?: R): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        return handleApiError(response, `POST request failed: ${endpoint}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      return handleApiError(error, `POST request error: ${endpoint}`);
    }
  }

  // PUT request
  protected async put<T, R = unknown>(endpoint: string, data?: R): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: getDefaultHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        return handleApiError(response, `PUT request failed: ${endpoint}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      return handleApiError(error, `PUT request error: ${endpoint}`);
    }
  }

  // DELETE request
  protected async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response, `DELETE request failed: ${endpoint}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      return handleApiError(error, `DELETE request error: ${endpoint}`);
    }
  }

  // File upload helper method
  protected async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = "file",
    extraData?: Record<string, string>
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      // Add extra data
      if (extraData) {
        Object.entries(extraData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        // No need to set Content-Type, browser will handle it
        headers: {
          // Exclude Content-Type, let the browser handle it automatically
          // Add authentication header
          ...(localStorage.getItem("auth_token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              }
            : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        return handleApiError(response, `File upload failed: ${endpoint}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      return handleApiError(error, `File upload error: ${endpoint}`);
    }
  }
}
