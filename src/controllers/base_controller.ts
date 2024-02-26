import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ObjectInterface> {
  model: Model<ObjectInterface>;
  constructor(model: Model<ObjectInterface>) {
    this.model = model;
  }

  async get(req: Request, res: Response) {
    console.log("get all trips");
    try {
      const objects = await this.model.find();
      res.status(200).send(objects);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    console.log(`get by id: ${req.params.id}`);
    try {
      const obj = await this.model.findById(req.params.id);
      res.send(obj);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  async post(req: Request, res: Response) {
    console.log(`post user ${req.body}`);
    const obj = new this.model(req.body);
    try {
      await obj.save();
      res.status(200).send("OK");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  async putById(req: Request, res: Response) {
    console.log("putById");
    const objId = req.params.id;
    try {
      const updateObj = await this.model.findByIdAndUpdate(objId, req.body, {
        new: true,
      });
      if (!updateObj) {
        return res.status(404).json({ message: `id: ${objId} is not found!` });
      }
      res.send(updateObj);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async deleteById(req: Request, res: Response) {
    console.log("delete ");
    try {
      const deleteObj = await this.model.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deleteObj) {
        return res
          .status(404)
          .json({ message: `id: ${req.params.id} is not found` });
      }
      res.send(`Object ${req.params.id} is deleted`);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

const createController = <ObjectInterface>(
  model: Model<ObjectInterface>
): BaseController<ObjectInterface> =>
  new BaseController<ObjectInterface>(model);

export default createController;
