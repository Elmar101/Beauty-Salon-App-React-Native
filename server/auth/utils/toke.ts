import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: {
  id: string;
  email: string;
  role:
    | "customer"
    | "admin"
    | "moderator"
    | "superAdmin"
    | "expert"
    | "secretary";
}): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN as string;

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const generateRefreshToken = (payload: {
  id: string;
}): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN as string;

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};
