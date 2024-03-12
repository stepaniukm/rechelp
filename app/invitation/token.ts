import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

const algorithm = "aes-256-ctr";
const secretKey = process.env.NUXT_INVITE_TOKEN_SECRET!;

export const encrypt = (text: string) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

export const decrypt = (encrypted: ReturnType<typeof encrypt>) => {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(encrypted.iv, "hex"),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};
