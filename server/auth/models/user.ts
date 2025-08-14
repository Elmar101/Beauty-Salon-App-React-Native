import  { Schema, Document, model } from "mongoose";

interface IUser extends Document {
    email: string;
    passwordHash: string;
    passwordSalt: string;
    fullName: string;
    proffession: string;
    phone: string;
    birthDate: Date;
    role: 'customer' | 'admin' | 'moderator' | 'superAdmin' | 'expert' | 'secretary';
    gender: 'male' | 'female';
    photoUrl: string;
    isVerified: boolean;
    verificationCode: string | null;
    verificationCodeExpires: Date | null;
    refreshToken: string;
    forgotPasswordCode: string;
    forgotPasswordExpires: Date;
    branchId: string;
    serviceIds: string[];
    isDeleted: boolean;
};

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, default: null, select: false },
    passwordSalt: { type: String, default: null, select: false },
    fullName: { type: String, requered: true, trim: true },
    phone: { type: String, requered: true, trim: true },
    proffession: { type: String, default: null, trim: true },
    birthDate: { type: Date, requered: true },
    role: {
      type: String,
      enum: [
        "customer",
        "admin",
        "moderator",
        "superAdmin",
        "expert",
        "secretary",
      ],
      default: 'customer',
    },
    gender: { type: String, enum: ["male", "female"], default: "male" },
    photoUrl: { type: String, default: "https://i.pravatar.cc/150" },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationCodeExpires: { type: Date, default: Date.now() },
    refreshToken: { type: String, default: null },
    forgotPasswordCode: { type: String, default: null },
    forgotPasswordExpires: { type: Date, default: Date.now() },
    branchId: { type: String, default: null },
    serviceIds: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
