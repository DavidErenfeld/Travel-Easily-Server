"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
/**
* @swagger
* tags:
*   name: Auth
*   description:  This is an API for handling user authentication including login, registration, and token refresh.
*/
/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/
/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/
/**
* @swagger
*   /auth/login:
*    post:
*      summary: Authenticates a user and returns tokens.
*      tags: [Auth]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*             $ref: '#/components/schemas/User'
*      responses:
*        '200':
*          description: Successfully authenticated. Returns access and refresh tokens.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  userName:
*                    type: string
*                  imgUrl:
*                    type: string
*                  accessToken:
*                    type: string
*                  refreshToken:
*                    type: string
*                  user_Id:
*                    type: string
*        '400':
*          description: Bad request, when some required fields are missing or credentials are invalid.
*        '500':
*          description: Server error.
*/
router.post("/login", auth_controller_1.default.login);
/**
* @swagger
*  /auth/register:
*   post:
*      summary: Registers a new user.
*      tags: [Auth]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                email:
*                  type: string
*                  format: email
*                password:
*                  type: string
*                userName:
*                  type: string
*                imgUrl:
*                  type: string
*              required:
*                - email
*                - password
*                - userName
*      responses:
*        '200':
*          description: User successfully registered.
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*        '400':
*          description: Bad request, when some required fields are missing or the email is already in use.
*        '500':
*          description: Server error.
*/
router.post("/register", auth_controller_1.default.register);
/**
* @swagger
* /auth/google:
*   post:
*     summary: Sign in with Google
*     tags: [Auth]
*     description: Authenticates a user by Google Sign-In token.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               token:
*                 type: string
*                 description: Google Sign-In token provided by the frontend.
*             required:
*               - token
*     responses:
*       '200':
*         description: User successfully authenticated.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: User authenticated successfully.
*                 user:
*                   $ref: '#/components/schemas/User'
*       '400':
*         description: Bad request - Incorrect or missing token.
*       '401':
*         description: Unauthorized - Invalid token or token expired.
*       '500':
*         description: Internal server error - Something went wrong during the authentication process.
*
* components:
*   schemas:
*     User:
*       type: object
*       properties:
*         _id:
*           type: string
*           description: Unique identifier for the user.
*         email:
*           type: string
*           description: User's email address.
*         name:
*           type: string
*           description: User's full name.
*         profilePic:
*           type: string
*           description: URL to the user's profile picture.
*       required:
*         - _id
*         - email
*         - name
*/
router.post("/google", auth_controller_1.default.googleSignin);
/**
* @swagger
*  /auth/logout:

*    post:
*      summary: Logs out a user by removing the refresh token.
*      tags: [Auth]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                refreshToken:
*                  type: string
*              required:
*                - refreshToken
*      responses:
*        '200':
*          description: Successfully logged out.
*        '401':
*          description: Unauthorized, no token provided.
*        '403':
*          description: Forbidden, invalid token.
*/
router.post("/logout", auth_controller_1.default.logout);
/**
* @swagger
*  /auth/refresh:
*    post:
*      summary: Refreshes access token using refresh token.
*      tags: [Auth]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                refreshToken:
*                  type: string
*              required:
*                - refreshToken
*      responses:
*        '200':
*          description: Successfully refreshed tokens.
*        '401':
*          description: Unauthorized, no token provided.
*        '403':
*          description: Forbidden, invalid token.

*components:
*  schemas:
*    User:
*      type: object
*      properties:
*        userName:
*          type: string
*        imgUrl:
*          type: string
*        email:
*          type: string
*          format: email
*        password:
*          type: string
*        tokens:
*          type: array
*          items:
*            type: string
*/
router.post("/refresh", auth_controller_1.default.refresh);
exports.default = router;
