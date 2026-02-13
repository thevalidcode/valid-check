import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  id: string;
  email: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) reject(err);
      else resolve(token!);
    });
  });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  return new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) resolve(null);
      else resolve(decoded as JWTPayload);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcrypt");
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const bcrypt = await import("bcrypt");
  return bcrypt.compare(password, hash);
}
