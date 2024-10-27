import { createHmac } from 'crypto'; // Ievieto HMAC (Hash-based Message Authentication Code) funkcionalitāti no crypto bibliotēkas

// Funkcija, kas analizē instanci, ņemot vērā tās noslēpumu
export function parseInstance(instance: string, appSecret: string) {
  // Sadala instanci divās daļās: hash un payload
  var parts = instance.split("."),
    hash = parts[0],
    payload = parts[1];
    
  // Ja nav payload, atgriež null
  if (!payload) {
    return null;
  }
  
  // Ja nav hash vai validācija neizdodas, atgriež null
  if (!hash || !validateInstance(hash, payload, appSecret)) {
    return null;
  }
  
  // Atgriež dekodētu payload kā JSON objektu
  return JSON.parse(base64Decode(payload, "utf8"));
}

// Funkcija, kas validē instanci, salīdzinot hash ar parakstīto payload
function validateInstance(hash: string, payload: string, secret: string) {
  // Ja nav hash, atgriež false
  if (!hash) {
    return false;
  }
  
  // Dekodē hash no base64 formāta
  hash = base64Decode(hash);
  
  // Izveido parakstītu hash, izmantojot payload un noslēpumu
  var signedHash = createHmac("sha256", secret)
    .update(payload)
    .digest("base64");
    
  // Atgriež true, ja hash sakrīt ar parakstīto hash
  return hash === signedHash;
}

// Funkcija, kas dekodē base64 ievadi un atgriež rezultātu norādītajā kodējumā
function base64Decode(input: string, encoding: "base64" | "utf8" = "base64") {
  // Aizvieto simbolus un dekodē ievadi
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString(encoding);
}
