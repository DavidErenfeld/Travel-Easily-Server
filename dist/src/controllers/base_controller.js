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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get all users");
            const objects = yield this.model.find();
            try {
                res.status(200).send(objects);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`get by id: ${req.params.id}`);
            try {
                const obj = yield this.model.findById(req.params.id);
                res.send(obj);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`post user ${req.body}`);
            const obj = new this.model(req.body);
            try {
                yield obj.save();
                res.status(200).send("OK");
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("putById");
            const objId = req.params.id;
            try {
                const updateObj = yield this.model.findByIdAndUpdate(objId, req.body, {
                    new: true,
                });
                if (!updateObj) {
                    return res.status(404).json({ message: `id: ${objId} is not found!` });
                }
                res.send(updateObj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("delete ");
            try {
                const deleteObj = yield this.model.findOneAndDelete({
                    _id: req.params.id,
                });
                if (!deleteObj) {
                    return res
                        .status(404)
                        .json({ message: `id: ${req.params.id} is not found` });
                }
                res.send(`Object ${req.params.id} is deleted`);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
const createController = (model) => new BaseController(model);
exports.default = createController;
//# sourceMappingURL=base_controller.js.map