import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import {
  concatUint8Arrays,
  uint8ArrayToHex,
  hexToUint8Array,
  toUint8Array,
  uint8ArrayToString,
} from "uint8array-extras";

const algorithm = "aes-256-ctr";
const secretKey = process.env.NUXT_INVITE_TOKEN_SECRET!;

export const encrypt = (text: string) => {
  const iv = toUint8Array(randomBytes(16));
  const cipher = createCipheriv(algorithm, secretKey, iv);

  const encrypted = concatUint8Arrays([cipher.update(text), cipher.final()]);

  return {
    iv: uint8ArrayToHex(iv),
    content: uint8ArrayToHex(encrypted),
  };
};

export const decrypt = (encrypted: ReturnType<typeof encrypt>) => {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    hexToUint8Array(encrypted.iv),
  );

  const decrypted = concatUint8Arrays([
    decipher.update(hexToUint8Array(encrypted.content)),
    decipher.final(),
  ]);

  return uint8ArrayToString(decrypted);
};
