import { Request, Response } from "express";
import UserModel from "../models/users_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../common/auth_middleware";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

const googleSignin = async (req: Request, res: Response) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email !== null) {
      let user = await UserModel.findOne({ email: email });
      if (user === null) {
        user = await UserModel.create({
          email: email,
          authType: "google",
          imgUrl: payload?.picture,
          userName: payload?.name,
        });
      }
      const accessToken = jwt.sign(
        { _id: user._id, userName: user.userName, imgUrl: user.imgUrl },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      const refreshToken = await jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET
      );

      const userName = user.userName;
      const imgUrl = user.imgUrl;
      const userId = user._id;

      if (user.tokens == null) {
        user.tokens = [refreshToken];
      } else {
        user.tokens.push(refreshToken);
      }
      await user.save();
      res.status(200).send({
        imgUrl: imgUrl,
        userName: userName,
        accessToken: accessToken,
        refreshToken: refreshToken,
        user_Id: userId,
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const register = async (req: AuthRequest, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;
  const imgUrl = req.body.imgUrl;

  if (email == null || password == null || userName == null) {
    return res.status(400).send("email or password or userName is null");
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
      userName: userName,
      email: email,
      password: hashedPassword,
      imgUrl: imgUrl,
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const login = async (req: AuthRequest, res: Response) => {
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

    if (user.authType !== "google") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("password is not match");
      }
    }

    const accessToken = jwt.sign(
      { _id: user._id, userName: user.userName, imgUrl: user.imgUrl },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const refreshToken = await jwt.sign(
      { _id: user._id, userName: user.userName, imgUrl: user.imgUrl },
      process.env.JWT_REFRESH_SECRET
    );

    const userName = user.userName;
    const imgUrl = user.imgUrl;
    const userId = user._id;

    if (user.tokens == null) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }
    await user.save();
    res.status(200).send({
      imgUrl: imgUrl,
      userName: userName,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user_Id: userId,
    });
  } catch (err) {
    return res.status(500).send("server error");
  }
};

const refresh = async (req: AuthRequest, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1];
  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }

      try {
        const newAccessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        );

        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: user._id },
          { $push: { tokens: newRefreshToken } },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(400).send("User not found");
        }

        res.status(200).send({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (updateError) {
        console.error("Error updating the user:", updateError);
        return res.status(500).send("Error updating user tokens");
      }
    }
  );
};

const logout = async (req: AuthRequest, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1];
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (typeof decoded === "object" && "_id" in decoded) {
      const userId = decoded._id;

      await UserModel.updateOne(
        { _id: userId },
        { $pull: { tokens: refreshToken } }
      );

      res.sendStatus(200);
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (err) {
    console.error("Error during logout: ", err);
    return res.sendStatus(403);
  }
};

export default { login, logout, register, refresh, googleSignin };

