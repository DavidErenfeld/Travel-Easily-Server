import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authMiddleWare from "../common/auth_middleware";


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



router.put("/:id", authMiddleWare, userController.updateUserById);

export default router;
