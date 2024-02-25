import express from "express";
const router = express.Router();
import AuthController from "../controllers/auth_controller";

/**
 * @swagger
 * openapi: 3.0.3
 * info:
 *   title: My API
 *   description: This is a sample server for a user management system.
 *   version: "1.0"
 * servers:
 *   - url: http://localhost:3000/
 *     description: Local server
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - userName
 *         - authType
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user (optional for social login)
 *         userName:
 *           type: string
 *           description: The username of the user
 *         imgUrl:
 *           type: string
 *           description: The profile image URL of the user
 *         tokens:
 *           type: array
 *           items:
 *             type: string
 *           description: JWT tokens for authentication
 *         authType:
 *           type: string
 *           description: The authentication type (e.g., application, google)
 *       example:
 *         _id: "12345"
 *         email: "user@example.com"
 *         userName: "exampleUser"
 *         imgUrl: "http://example.com/img.jpg"
 *         authType: "application"
 *         tokens: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."]
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userName:
 *                 type: string
 *               imgUrl:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - userName
 *           example:
 *             email: "newuser@example.com"
 *             password: "password123"
 *             userName: "newUser"
 *             imgUrl: "http://example.com/img.jpg"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Email already exists or missing data
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 imgUrl:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 userId:
 *                   type: string
 *               example:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 imgUrl: "http://example.com/img.jpg"
 *                 userName: "user"
 *                 userId: "12345"
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticates a user using Google Sign-In
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *             required:
 *               - credential
 *           example:
 *             credential: "google-id-token"
 *     responses:
 *       200:
 *         description: User authenticated successfully with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 imgUrl:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 userId:
 *                   type: string
 *               example:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 imgUrl: "http://example.com/img.jpg"
 *                 userName: "user"
 *                 userId: "12345"
 */

router.post("/google", AuthController.googleSignin);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refreshes the user's authentication token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *           example:
 *             refreshToken: "refreshTokenHere"
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *               example:
 *                 accessToken: "newAccessTokenHere"
 *                 refreshToken: "newRefreshTokenHere"
 */

router.post("/refresh", AuthController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out the user by invalidating the refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *           example:
 *             refreshToken: "refreshTokenHere"
 *     responses:
 *       200:
 *         description: User logged out successfully
 */

router.post("/logout", AuthController.logout);

export default router;
