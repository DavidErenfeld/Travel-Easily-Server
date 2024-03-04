"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
* @swagger
*paths:
*  /users/{id}:
*    put:
*      summary: Update a user by ID
*      tags:
*        - Users
*      parameters:
*        - name: id
*          in: path
*          required: true
*          schema:
*            type: string
*          description: The user's ID
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                userName:
*                  type: string
*                  description: The new user name
*                imgUrl:
*                  type: string
*                  description: The URL to the new profile image
*              required:
*                - userName
*      responses:
*        '200':
*          description: The user was successfully updated
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*        '404':
*          description: User not found or you do not have permission to update it
*        '500':
*          description: Internal server error
*components:
*  schemas:
*    User:
*      type: object
*      properties:
*        _id:
*          type: string
*          description: The user ID
*        email:
*          type: string
*/
router.put("/:id", auth_middleware_1.default, user_controller_1.default.updateUserById);
exports.default = router;
