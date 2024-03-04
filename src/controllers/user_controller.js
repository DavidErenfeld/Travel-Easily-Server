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
const trips_model_1 = __importDefault(require("../models/trips_model"));
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("putById method called");
    const userId = req.params.id;
    try {
        const obj = yield users_model_1.default.findOne({ _id: userId });
        if (!obj) {
            return res.status(404).json({
                message: "User not found or you do not have permission to update it.",
            });
        }
        const updateUser = yield users_model_1.default.findByIdAndUpdate(userId, req.body, {
            new: true,
        });
        if (updateUser) {
            // Update user details in all trips owned by the user
            yield trips_model_1.default.updateMany({ owner: userId }, {
                $set: {
                    userName: updateUser.userName,
                    imgUrl: updateUser.imgUrl,
                },
            });
        }
        res.status(200).send(updateUser);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = {
    updateUserById,
};
