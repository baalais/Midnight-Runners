// Funkcija, lai iegūtu lietotnes instanci no URL vaicājuma parametriem
export function getAppInstance() {
  return new URLSearchParams(window.location.search).get("instance")!; // Atgriež 'instance' parametra vērtību
}

// Funkcija, lai veiktu fetch pieprasījumu ar Wix instanci
export async function fetchWithWixInstance(url: string, options: RequestInit) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: getAppInstance(), // Pievieno Authorization galveni ar iegūto instanci
      ...options.headers, // Apvieno ar esošajām galvenēm
    },
  });
}
