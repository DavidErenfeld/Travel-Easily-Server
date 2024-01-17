import Trips, { ITrips } from "../models/trips_model";
import { BaseController } from "../controllers/base_controller";
import { Model } from "mongoose";
// import { AuthRequest } from "./base_controller";
import { Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: { _id: string };
}

class TripsController extends BaseController<ITrips> {
  constructor(model: Model<ITrips>) {
    super(model);
  }

  async getByOwner(req: AuthRequest, res: Response) {
    console.log(`get by id: ${req.params.owner}`);
    try {
      const obj = await this.model.find({ owner: req.params.owner });
      res.send(obj);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  /////////////////////?????????????????מה עוזר לי לשנות את ה message אם אני שולח את הbody?????????????/////////////////////////////
  async post(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const message = req.body.owner;
    req.body.owner = userId;

    super.post(req, res);
  }

  async putById(req: AuthRequest, res: Response) {
    console.log("putById");
    const userId = req.user._id; // ID של המשתמש המחובר מהטוקן
    const objId = req.params.id; // ID של האובייקט למחיקה

    const message = req.body;
    req.body.owner = userId;
    try {
      // מחפש את האובייקט שמתאים ל-ID ובבעלות המשתמש הנוכחי
      const obj = await this.model.findOne({ _id: objId, owner: userId });

      if (!obj) {
        return res.status(404).json({
          message:
            "Object not found or you do not have permission to update it.",
        });
      }

      const updateObj = await this.model.findByIdAndUpdate(objId, req.body, {
        new: true,
      });

      res.send(updateObj);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async deleteById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id; // ID של המשתמש המחובר מהטוקן
      const objId = req.params.id; // ID של האובייקט למחיקה

      // מחפש את האובייקט שמתאים ל-ID ובבעלות המשתמש הנוכחי
      const obj = await this.model.findOne({ _id: objId, owner: userId });

      if (!obj) {
        return res.status(404).json({
          message:
            "Object not found or you do not have permission to delete it.",
        });
      }

      await this.model.deleteOne({ _id: objId });
      res.send(`Object ${objId} is deleted`);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new TripsController(Trips);
