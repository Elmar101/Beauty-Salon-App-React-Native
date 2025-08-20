import type { Request, Response } from "express";
import User from "../models/user";

export const getUserById = async (req: Request, res: Response, next: Function) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json("Internal Server Error");
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json("Internal Server Error");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { fullName, phone, birthDate, proffession, role, serviceIds, branchId } = req.body;

  try {
    // const user = await User.findByIdAndUpdate(userId, { photo, fullName, phone, birthDate, proffession, role, serviceIds, branchId }, { new: true });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (req.file) {
      user.photoUrl = req.file.fieldname;
    }
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.birthDate = birthDate || user.birthDate;
    user.proffession = proffession || user.proffession;
    user.role = role || user.role;
    user.serviceIds = serviceIds || user.serviceIds;
    user.branchId = branchId || user.branchId;
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json("Internal Server Error");
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json("Internal Server Error");
  }
}
export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    await User.deleteMany();
    res.status(200).json("All users deleted successfully");
  } catch (error) {
    console.error("Error deleting all users:", error);
    res.status(500).json("Internal Server Error");
  }
}

