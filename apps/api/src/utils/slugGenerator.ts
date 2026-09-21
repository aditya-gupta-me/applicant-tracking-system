import crypto from "node:crypto";

const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function randomShortId(length = 6): string {
  let result = "";

  while (result.length < length) {
    const bytes = crypto.randomBytes(length);

    for (const byte of bytes) {
      if (byte >= 248) continue;

      result += ALPHABET[byte % 62];

      if (result.length === length) break;
    }
  }

  return result;
}