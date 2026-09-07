import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../../../../config/env.js";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
};

export function issueAuthTokens(userId: string): AuthTokens {
  const accessToken = jwt.sign({ id: userId }, ENV.ACCESS_TOKEN, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: userId }, ENV.REFRESH_TOKEN, { expiresIn: "7d" });

  const refreshTokenHash = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");

  return { accessToken, refreshToken, refreshTokenHash };
}