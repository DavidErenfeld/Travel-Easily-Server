import { Request, Response } from "express";
import UserModel, { IUsers } from "../models/users_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../common/auth_middleware";

const register = async (req: AuthRequest, res: Response) => {
  console.log("register");
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).send("email or password is null");
  }

  try {
    const existUser = await UserModel.findOne({ email: email });
    if (existUser != null) {
      return res.status(400).send("email is exist");
    }
  } catch (err) {
    res.status(500).send("server error");
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      email: email,
      password: hashedPassword,
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const login = async (req: AuthRequest, res: Response) => {
  console.log("login");
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).send("email or password is null");
  }

  try {
    const user = await UserModel.findOne({ email: email });
    if (user == null) {
      return res.status(400).send("bad email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("password is not match");
    }

    // Create accessToken
    const accessToken = await jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Create refreshToken
    const refreshToken = await jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );

    // Put refreshToken in the DB
    if (user.tokens == null) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }
    await user.save();
    res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return res.status(500).send("server error");
  }
};

const refresh = async (req: AuthRequest, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }
      try {
        const userDb = await UserModel.findOne({ _id: user._id });
        if (!userDb.tokens || !userDb.tokens.includes(refreshToken)) {
          userDb.tokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        );
        userDb.tokens = userDb.tokens.filter((token) => token !== refreshToken);
        userDb.tokens.push(newRefreshToken);
        await userDb.save();
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};

const logout = async (req: AuthRequest, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) return res.sendStatus(401);

      try {
        const userDb = await UserModel.findOne({ _id: user._id });
        if (!userDb.tokens || !userDb.tokens.includes(refreshToken)) {
          userDb.tokens = [];
          await userDb.save();

          return res.sendStatus(401);
        } else {
          userDb.tokens = userDb.tokens.filter((t) => t !== refreshToken);
          await userDb.save();
          return res.sendStatus(200);
        }
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};
export default { login, logout, register, refresh };
