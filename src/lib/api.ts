import type { Envelope } from "../types/api";
import { trackRequest } from "./wakeUp";

// Falls back to localhost:8080 for local dev against `docker compose up`.
// Set VITE_API_BASE_URL in a .env file to point elsewhere (see .env.example).
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

const TOKEN_KEY = "eventapp_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Thrown whenever the API responds with `success: false` (or the
 * request fails outright). `message` is always safe to show the user
 * directly — it's the same string the backend puts in `error`.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  // Plain object → sent as JSON. FormData → sent as multipart (for the
  // event endpoints, which take an image file).
  body?: unknown;
  auth?: boolean; // attach the Authorization header — defaults to true
}

async function requestEnvelope<T>(
  path: string,
  options: RequestOptions = {},
): Promise<Envelope<T>> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {};
  const isFormData = body instanceof FormData;

  // FormData sets its own multipart Content-Type (with the boundary) —
  // setting it ourselves here would strip that boundary out.
  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await (async () => {
    const done = trackRequest();
    try {
      return await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body:
          body === undefined
            ? undefined
            : isFormData
              ? body
              : JSON.stringify(body),
      });
    } finally {
      done();
    }
  })();

  // A 204 or an empty body (e.g. DELETE endpoints) has nothing to
  // parse — treat it as success with no data rather than erroring on
  // invalid JSON.
  const text = await res.text();
  const envelope: Envelope<T> = text ? JSON.parse(text) : { success: res.ok };

  if (!envelope.success) {
    throw new ApiError(envelope.error ?? "Something went wrong", res.status);
  }

  return envelope;
}

/**
 * The one place that knows how to talk to the API: builds the URL,
 * attaches the token, unwraps the Envelope, and turns a failure
 * response into a thrown ApiError. Every function in this file's
 * siblings (auth.ts, events.ts, ...) is a thin wrapper around this —
 * either this or requestWithMeta below, for the one endpoint
 * (event list) that also returns pagination info.
 */
async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const envelope = await requestEnvelope<T>(path, options);
  return envelope.data as T;
}

export const api = {
  get: <T>(path: string, auth = true) =>
    request<T>(path, { method: "GET", auth }),
  // For endpoints that return pagination alongside data (currently
  // just the event list) — M is the meta shape, e.g. PageMeta.
  getWithMeta: <T, M>(path: string, auth = true) =>
    requestEnvelope<T>(path, { method: "GET", auth }).then((envelope) => ({
      data: envelope.data as T,
      meta: envelope.meta as M,
    })),
  post: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "PUT", body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "PATCH", body, auth }),
  delete: <T>(path: string, auth = true) =>
    request<T>(path, { method: "DELETE", auth }),
};
