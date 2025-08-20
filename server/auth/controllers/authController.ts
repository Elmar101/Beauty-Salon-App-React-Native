import type { Request, Response } from "express";
import User from "../models/user";
import { comparePassword, generateSalt, hashPassword } from "../utils/password";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/toke';
import type { JwtPayload } from "jsonwebtoken";

interface IRegisterUser {
  fullName: string;
  email: string;
  password: string;
  proffession: string;
  phone: string;
  birthDate: Date;
  role:
    | "customer"
    | "admin"
    | "moderator"
    | "superAdmin"
    | "expert"
    | "secretary";
  gender: "male" | "female";
}

export const registerContoller = async (
  req: Request<any, any, IRegisterUser>,
  res: Response
) => {
  try {
    const {
      fullName,
      email,
      password,
      proffession,
      phone,
      birthDate,
      role,
      gender,
    } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json("Bad Request");
      return;
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      res.status(400).json("User already exists");
      return;
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    const verificationCode = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const photoUrl = req.file
      ? req.file.fieldname
      : gender === "male"
      ? "/assets/images/male.png"
      : "/assets/images/female.png";
    const user = new User({
      fullName,
      email,
      passwordHash,
      passwordSalt: salt,
      proffession,
      phone,
      birthDate,
      role,
      gender,
      photoUrl,
      verificationCode,
      verificationCodeExpires: expires,
    });

    await user.save();
  
    res.status(201).json({
      message: "User created successfully",
      verificationCode,
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const verifyController = async (req: Request<any, any, { code: string; email: string }>, res: Response) => {
  try {
    const { code, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json("User not found");
      return;
    }

    if (user.isVerified) {
      res.status(400).json("User already verified");
      return;
    }
  
    if (
      user.verificationCode !== code ||
      (user.verificationCodeExpires ?? new Date()) < new Date()
    ) {
      res.status(400).json("Invalid verification code or expired");
      return;
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    const token = generateAccessToken({id: user._id as string, email: user.email, role: user.role});
    const refreshToken = generateRefreshToken({id: user._id as string});

    user.refreshToken = refreshToken;

    await user.save();

    res.status(200).json({message: "User verified successfully", data: {token, refreshToken}});
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json("Bad Request");
      return;
    }
    const user = await User.findOne({ email });
    if (!user || !user.isVerified || user.isDeleted || !comparePassword(password, user.passwordHash, user.passwordSalt)) {
      res.status(404).json({message: "Invalid email or password"});
      return;
    }
    const token = generateAccessToken({id: user._id as string, email: user.email, role: user.role});
    const refreshToken = generateRefreshToken({id: user._id as string});
    user.refreshToken = refreshToken;
    await user.save();
    // res.cookie('token', token, {httpOnly: true, sameSite: 'none', secure: true});
    res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'none', secure: true});
    res.status(200).json({message: "User logged in successfully", data: {token, refreshToken}});
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  // const { refreshToken } = req.cookies;
  const refreshToken = req.body;
  if (!refreshToken) {
    res.status(401).json("Unauthorized");
    return;
  }
  try {
    const payload: JwtPayload = verifyRefreshToken(refreshToken) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      res.status(401).json("Refresh token expired");
      return;
    }
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json("Unauthorized");
      return;
    }
    const token = generateAccessToken({id: user._id as string, email: user.email, role: user.role});
    const newRefreshToken = generateRefreshToken({id: user._id as string});
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, sameSite: 'none', secure: true});
    res.status(200).json({message: "Token refreshed successfully", data: {token, refreshToken: newRefreshToken}});
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'none', secure: true});
    const refreshToken = req.body;
    if (!refreshToken) {
      res.status(400).json("Bad Request");
      return;
    }
    const payload: JwtPayload = verifyRefreshToken(refreshToken) as JwtPayload;
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json("Unauthorized");
      return;
    }
    user.refreshToken = null;
    await user.save();
    res.status(200).json("User logged out successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400).json("Bad Request");
      return;
    }
    const user = await User.findOne({ email });
    if (!user || !user.isVerified || user.isDeleted) {
      res.status(404).json("User not found");
      return;
    }
    const forgotPasswordCode = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    user.forgotPasswordCode = forgotPasswordCode.toString();
    user.forgotPasswordExpires = expires;
    await user.save();
    res.status(200).json({message: "Forgot password code sent", data: {forgotPasswordCode}});
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};    

export const verifyForgotPasswordController = async (req: Request, res: Response) => {
  const { code, password } = req.body;
  try {
    if (!code || !password) {
      res.status(400).json("Bad Request");
      return;
    }
    const user = await User.findOne({ forgotPasswordCode: code });
    if (!user || !user.isVerified || user.isDeleted || (user.forgotPasswordExpires ?? new Date()) < new Date()) {
      res.status(404).json("Invalid code or expired");
      return;
    }      
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    user.passwordHash = passwordHash;
    user.passwordSalt = salt;
    user.forgotPasswordCode = null;
    user.forgotPasswordExpires = null;
    const token = generateAccessToken({id: user._id as string, email: user.email, role: user.role});
    const refreshToken = generateRefreshToken({id: user._id as string});
    user.refreshToken = refreshToken;
    // res.cookie('token', token, {httpOnly: true, sameSite: 'none', secure: true});
    res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'none', secure: true});
    await user.save();
    res.status(200).json({message: "Password reset successfully", data: {token, refreshToken}});
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    if (!oldPassword || !newPassword) {
      res.status(400).json("Bad Request");
      return;
    }
    const user = await User.findOne({ email });
    if (!user || !comparePassword(oldPassword, user.passwordHash, user.passwordSalt)) {
      res.status(404).json("Invalid old password");
      return;
    }
    const salt = generateSalt();
    const passwordHash = hashPassword(newPassword, salt);
    user.passwordHash = passwordHash;
    user.passwordSalt = salt;
    await user.save();    
    res.status(200).json("Password changed successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
