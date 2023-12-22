import { randomBytes, createHash } from "crypto";

export function generateToken(length: number): string {
  const buffer: Buffer = randomBytes(length);

  let token = Buffer.from(
    createHash("sha256").update(buffer).digest()
  ).toString("hex");

  return token;
}
