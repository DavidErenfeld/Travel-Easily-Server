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
const trips_model_1 = __importDefault(require("../models/trips_model"));
const getAllTrips = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get all trips");
    try {
        const objects = yield trips_model_1.default.find();
        res.status(200).send(objects);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
const getByOwnerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`get by id: ${req.params.id}`);
    try {
        const trips = yield trips_model_1.default.find({ owner: req.params.id });
        if (trips.length > 0)
            return res.status(200).send(trips);
        res.status(201).send(trips);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
const getByTripId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trips = yield trips_model_1.default.findOne({ _id: req.params.id });
        res.status(200).send(trips);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`post trip ${req.body}`);
    const userId = req.user._id;
    const userName = req.user.userName;
    console.log(`-------------${userName}`);
    req.body.owner = userId;
    req.body.userName = userName;
    console.log(`Saving trip with userName: ${req.body.userName}`);
    try {
        const obj = yield trips_model_1.default.create(req.body);
        res.status(200).send("OK");
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});
const putById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("putById method called");
    const userId = req.user._id;
    const objId = req.params.id;
    try {
        const obj = yield trips_model_1.default.findOne({ _id: objId, owner: userId });
        if (!obj) {
            return res.status(404).json({
                message: "Object not found or you do not have permission to update it.",
            });
        }
        const updateObj = yield trips_model_1.default.findByIdAndUpdate(objId, req.body, {
            new: true,
        });
        res.send(updateObj);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const objId = req.params.id;
        const obj = yield trips_model_1.default.findOne({ _id: objId, owner: userId });
        if (!obj) {
            return res.status(404).json({
                message: "Object not found or you do not have permission to delete it.",
            });
        }
        yield trips_model_1.default.deleteOne({ _id: objId });
        res.send(`Object ${objId} is deleted`);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("addComment");
    try {
        const tripId = req.params.tripId;
        if (!req.user) {
            return res.status(401).send("User not authenticated");
        }
        const owner_id = req.user._id;
        const { comment } = req.body;
        const trip = yield trips_model_1.default.findById(tripId);
        if (!trip) {
            return res.status(404).send("Trip not found");
        }
        trip.comments.push({
            ownerId: owner_id,
            owner: comment.owner,
            comment: comment.comment,
            date: comment.date,
        });
        trip.numOfComments++;
        yield trip.save();
        res.status(200).send(trip.comments);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DeleteComment");
    try {
        const tripId = req.params.tripId;
        const commentId = req.params.commentId;
        const trip = yield trips_model_1.default.findById(tripId);
        if (!trip) {
            return res.status(404).send("Trip not found");
        }
        console.log(`befor delete: ${trip}`);
        trip.comments = trip.comments.filter((comment) => comment._id.toString() !== commentId);
        trip.numOfComments = trip.comments.length;
        console.log(`after delete: ${trip}`);
        yield trip.save();
        res.status(200).send(trip.comments);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tripId = req.params.tripId;
        const userId = req.user._id;
        req.body.owner = userId;
        const trip = yield trips_model_1.default.findById(tripId);
        if (!trip) {
            return res.status(404).send("Trip not found");
        }
        if (!trip.likes.some((like) => like.owner === userId)) {
            trip.likes.push({ owner: userId });
            trip.numOfLikes++;
            yield trip.save();
            return res.status(200).send(trip);
        }
        trip.likes = trip.likes.filter((user) => user.owner !== userId);
        trip.numOfLikes--;
        yield trip.save();
        return res.status(200).send(trip);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.default = {
    getAllTrips,
    getByOwnerId,
    getByTripId,
    post,
    putById,
    deleteById,
    addComment,
    deleteComment,
    addLike,
};
//# sourceMappingURL=trips_controller.js.map
