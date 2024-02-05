import Trips, { ITrips } from "../models/trips_model";

import mongoose, { Model } from "mongoose";
// import { AuthRequest } from "./base_controller";
import { Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    userName: string;
    imgUrl: string;
  };
}

const getAllTrips = async (req: Request, res: Response) => {
  console.log("get all trips");
  const objects = await Trips.find();
  try {
    res.status(200).send(objects);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req: Request, res: Response) => {
  console.log(`get by id: ${req.params.id}`);
  try {
    // הנחתי שהמזהה של המשתמש מועבר כreq.params.id ולא כreq.params._id
    const trips = await Trips.find({ owner: req.params.id }); // שימוש בfind במקום findById ותיקון הפרמטר לowner
    res.send(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const post = async (req: AuthRequest, res: Response) => {
  console.log(`post user ${req.body}`);
  const userId = req.user._id;
  const userName = req.user.userName;
  const imgUrl = req.user.imgUrl;
  req.body.owner = userId;
  req.body.userName = userName;
  req.body.imgUrl = imgUrl;

  const obj = new Trips(req.body);
  try {
    await obj.save();
    res.status(200).send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const putById = async (req: AuthRequest, res: Response) => {
  console.log("putById method called");
  const userId = req.user._id;
  const objId = req.params.id;

  try {
    const obj = await Trips.findOne({ _id: objId, owner: userId });
    if (!obj) {
      return res.status(404).json({
        message: "Object not found or you do not have permission to update it.",
      });
    }

    const updateObj = await Trips.findByIdAndUpdate(objId, req.body, {
      new: true,
    });

    res.send(updateObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id; // ID של המשתמש המחובר מהטוקן
    const objId = req.params.id; // ID של האובייקט למחיקה

    // מחפש את האובייקט שמתאים ל-ID ובבעלות המשתמש הנוכחי
    const obj = await Trips.findOne({ _id: objId, owner: userId });

    if (!obj) {
      return res.status(404).json({
        message: "Object not found or you do not have permission to delete it.",
      });
    }

    await Trips.deleteOne({ _id: objId });
    res.send(`Object ${objId} is deleted`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addComment = async (req: AuthRequest, res: Response) => {
  try {
    // קבלת מזהה הטיול מהנתיב
    const tripId = req.params.tripId;
    // בדיקה שהמשתמש מאומת דרך ה-middleware
    if (!req.user) {
      return res.status(401).send("User not authenticated");
    }
    const userName = req.user.userName;
    const owner_id = req.user._id;
    const { comment } = req.body;

    // חיפוש הטיול במסד הנתונים
    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).send("Trip not found");
    }

    // הוספת התגובה למערך התגובות של הטיול
    trip.comments.push({
      ownerId: owner_id,
      owner: userName,
      comment: comment,
      date: new Date(),
    });
    trip.numOfComments++;

    // שמירת הטיול עם התגובה החדשה
    await trip.save();

    // שליחת המענה המעודכן
    res.status(200).send(trip);
  } catch (error) {
    // טיפול בשגיאות
    res.status(500).send(error.message);
  }
};

const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.tripId;
    const commentId = req.params.commentId; // מזהה המשתמש מהאימות

    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).send("Trip not found");
    }

    trip.comments = trip.comments.filter(
      (comment) => comment._id === commentId
    );
    trip.numOfComments > 0 ? trip.numOfComments-- : (trip.numOfComments = 0);
    await trip.save();

    res.status(200).send(trip);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addLike = async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.tripId;
    const userId = req.user._id; // שימוש במחרוזת כפי שהיא
    req.body.owner = userId;

    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).send("Trip not found");
    }

    if (!trip.likes.some((like) => like.owner === userId)) {
      trip.likes.push({ owner: userId });
      trip.numOfLikes++;
      await trip.save();
      return res.status(200).send(trip);
    }
    trip.likes = trip.likes.filter((user) => user.owner !== userId);
    trip.numOfLikes--;
    await trip.save();
    return res.status(200).send(trip);
    // res.status(201).send("It is not possible to give 2 likes");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// const removeLike = async (req: AuthRequest, res: Response) => {
//   try {
//     const tripId = req.params.tripId;
//     const userId = req.user._id; // מזהה המשתמש מהאימות
//     req.body.owner = userId;

//     const trip = await Trips.findById(tripId);
//     if (!trip) {
//       return res.status(404).send("Trip not found");
//     }

//     trip.likes = trip.likes.filter((user) => user.owner !== userId);
//     trip.numOfLikes--;
//     await trip.save();

//     res.status(200).send(trip);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

export default {
  getAllTrips,
  getById,
  post,
  putById,
  deleteById,
  addComment,
  deleteComment,
  addLike,
};
