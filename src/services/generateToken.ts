import jwt from "jsonwebtoken";
import config from "../config/keys";

interface Payload {
  [key: string]: any;
}

interface GenerateTokenFunction {
  (payload: Payload, expiresIn: string): string | Error;
}

const generateAccessToken: GenerateTokenFunction = (payload, expiresIn) => {
  try {
  const token = jwt.sign(payload, config.jwt.accessSecret, { expiresIn });
  if (!token) throw new Error("Internal Server Error");
  return `Bearer ${token}`;
} catch (err:any) {
  console.error("Error generating access token:", err);
  return err // Return an empty string or handle as needed
}
};

const generateRefreshToken: GenerateTokenFunction = (payload, expiresIn) => {
  try{
  const token = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn });
  if (!token) throw new Error("Internal Server Error");
  return `Bearer ${token}`;
} catch (err:any) {
  console.error("Error generating access token:", err);
  return err // Return an empty string or handle as needed
}
};

export { generateAccessToken, generateRefreshToken };
