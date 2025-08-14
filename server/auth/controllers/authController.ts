import type { Request, Response } from "express";
import User from "../models/user";
import { generateSalt, hashPassword } from "../utils/password";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateAccessToken, generateRefreshToken } from '../utils/toke';

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

export const verifyController = async (req: Request, res: Response) => {
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
   console.log(user.verificationCode , code, user.verificationCodeExpires, new Date())
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
