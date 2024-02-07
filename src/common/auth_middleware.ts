import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: { _id: string; userName: string; imgUrl?: string };
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send("Token is null");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);

    if (
      typeof verified === "object" &&
      verified !== null &&
      "_id" in verified
    ) {
      req.user = { _id: verified._id, userName: verified.userName }; // עדכון זה
      next();
    } else {
      return res.status(401).send("Invalid token structure");
    }
  } catch (err) {
    return res.status(401).send("Token is invalid");
  }
};

export default authMiddleware;
