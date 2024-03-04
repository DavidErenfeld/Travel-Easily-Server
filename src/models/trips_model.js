"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tripsSchema = new mongoose_1.default.Schema({
    owner: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
    },
    imgUrl: {
        type: String,
    },
    typeTraveler: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    typeTrip: {
        type: String,
        required: true,
    },
    numOfDays: {
        type: Number,
        required: true,
    },
    tripPhotos: {
        type: [String],
    },
    tripDescription: {
        type: [String],
        required: true,
    },
    comments: [
        {
            ownerId: String,
            owner: String,
            comment: String,
            date: Date,
        },
    ],
    numOfComments: {
        type: Number,
        required: true,
        default: 0,
    },
    likes: [{ owner: String, date: Date }],
    numOfLikes: {
        type: Number,
        required: true,
        default: 0,
    },
});
exports.default = mongoose_1.default.model("Trip", tripsSchema);
