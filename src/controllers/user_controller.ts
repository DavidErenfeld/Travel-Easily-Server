import Users, { IUsers } from "../models/users_model";
import mongoose, { Model } from "mongoose";
import { Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    userName: string;
    imgUrl: string;
  };
}

const updateUserById = async (req: AuthRequest, res: Response) => {
  console.log("putById method called");
  const userId = req.params.id;

  try {
    const obj = await Users.findOne({ _id: userId });
    if (!obj) {
      return res.status(404).json({
        message: "User not found or you do not have permission to update it.",
      });
    }

    const updateUser = await Users.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    console.log(updateUser);
    res.status(200).send(updateUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  updateUserById,
};
