import { createHmac } from 'crypto';

export function parseInstance(instance: string, appSecret: string) {
  var parts = instance.split("."),
    hash = parts[0],
    payload = parts[1];
  if (!payload) {
    return null;
  }
  if (!hash || !validateInstance(hash, payload, appSecret)) {
    return null;
  }
  return JSON.parse(base64Decode(payload, "utf8"));
}

function validateInstance(hash: string, payload: string, secret: string) {
  if (!hash) {
    return false;
  }
  hash = base64Decode(hash);
  var signedHash = createHmac("sha256", secret)
    .update(payload)
    .digest("base64");
  return hash === signedHash;
}

function base64Decode(input: string, encoding: "base64" | "utf8" = "base64") {
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString(encoding);
}