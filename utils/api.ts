interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const apiFetch = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  // Merge custom headers with default headers
  const headers = new Headers(options.headers);

  // Add ngrok skip browser warning header
  headers.set("ngrok-skip-browser-warning", "true");

  // If Content-Type is not set and body exists, set it to application/json
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const requestUrl =`${API_BASE_URL}/${url}`;

  // Make the fetch request with merged headers
  return fetch(requestUrl, {
    ...options,
    headers,
  });
};
