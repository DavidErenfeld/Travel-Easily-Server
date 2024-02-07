import Users from "../models/users_model";
import Trips from "../models/trips_model";
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

    // עדכון הפרטים של המשתמש בכל הטיולים שבבעלותו
    if (updateUser) {
      await Trips.updateMany(
        { owner: userId },
        {
          $set: {
            userName: updateUser.userName,
            imgUrl: updateUser.imgUrl,
          },
        }
      );
    }
    res.status(200).send(updateUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  updateUserById,
};
