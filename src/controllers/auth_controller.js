"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../models/users_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
const googleSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email !== null) {
            let user = yield users_model_1.default.findOne({ email: email });
            if (user === null) {
                user = yield users_model_1.default.create({
                    email: email,
                    authType: "google",
                    imgUrl: payload === null || payload === void 0 ? void 0 : payload.picture,
                    userName: payload === null || payload === void 0 ? void 0 : payload.name,
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, userName: user.userName, imgUrl: user.imgUrl }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = yield jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            const userName = user.userName;
            const imgUrl = user.imgUrl;
            const userId = user._id;
            if (user.tokens == null) {
                user.tokens = [refreshToken];
            }
            else {
                user.tokens.push(refreshToken);
            }
            yield user.save();
            res.status(200).send({
                imgUrl: imgUrl,
                userName: userName,
                accessToken: accessToken,
                refreshToken: refreshToken,
                user_Id: userId,
            });
        }
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.userName;
    const imgUrl = req.body.imgUrl;
    if (email == null || password == null || userName == null) {
        return res.status(400).send("email or password or userName is null");
    }
    try {
        const existUser = yield users_model_1.default.findOne({ email: email });
        if (existUser != null) {
            return res.status(400).send("email is exist");
        }
    }
    catch (err) {
        res.status(500).send("server error");
    }
    try {
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield users_model_1.default.create({
            userName: userName,
            email: email,
            password: hashedPassword,
            imgUrl: imgUrl,
        });
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send("Server error");
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("email or password is null");
    }
    try {
        const user = yield users_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send("bad email or password");
        }
        if (user.authType !== "google") {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send("password is not match");
            }
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, userName: user.userName, imgUrl: user.imgUrl }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, userName: user.userName, imgUrl: user.imgUrl }, process.env.JWT_REFRESH_SECRET);
        const userName = user.userName;
        const imgUrl = user.imgUrl;
        const userId = user._id;
        if (user.tokens == null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        yield user.save();
        res.status(200).send({
            imgUrl: imgUrl,
            userName: userName,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user_Id: userId,
        });
    }
    catch (err) {
        return res.status(500).send("server error");
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1];
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        try {
            const newAccessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            const updatedUser = yield users_model_1.default.findOneAndUpdate({ _id: user._id }, { $push: { tokens: newRefreshToken } }, { new: true });
            if (!updatedUser) {
                return res.status(400).send("User not found");
            }
            res.status(200).send({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        }
        catch (updateError) {
            console.error("Error updating the user:", updateError);
            return res.status(500).send("Error updating user tokens");
        }
    }));
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1];
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (typeof decoded === "object" && "_id" in decoded) {
            const userId = decoded._id;
            yield users_model_1.default.updateOne({ _id: userId }, { $pull: { tokens: refreshToken } });
            res.sendStatus(200);
        }
        else {
            throw new Error("Invalid token payload.");
        }
    }
    catch (err) {
        console.error("Error during logout: ", err);
        return res.sendStatus(403);
    }
});
exports.default = { login, logout, register, refresh, googleSignin };
//# sourceMappingURL=auth_controller.js.map
