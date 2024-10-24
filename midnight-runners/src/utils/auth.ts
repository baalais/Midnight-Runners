// utils/auth.ts

export function getAppInstance() {
  return new URLSearchParams(window.location.search).get("instance")!;
}

export async function fetchWithWixInstance(url: string, options: RequestInit) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: getAppInstance(),
      ...options.headers,
    },
  });
}
