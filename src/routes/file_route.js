"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
// Define the base URL for the server
const base = "http://localhost:3000";
// Configure multer storage settings
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/");
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using the current timestamp
        const ext = file.originalname.split(".").pop();
        const date = new Date();
        const formattedDate = date
            .toISOString()
            .replace(/:/g, "-") // Replace colons with dashes to avoid filename issues
            .replace(/\..+$/, ""); // Remove milliseconds and Z from the timestamp
        cb(null, formattedDate + "." + ext);
    },
});
// Initialize multer with the configured storage
const upload = (0, multer_1.default)({ storage: storage });
/**
 * @swagger
 * /file/:
 *   post:
 *     summary: Upload a file
 *     tags: [File]
 *     description: Uploads a file to the server and returns its URL.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload.
 *     responses:
 *       '200':
 *         description: File successfully uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file.
 *                   example: http://localhost:3000/public/uploads/file-12345.png
 *       '400':
 *         description: Bad request - Error during the file upload process.
 *       '500':
 *         description: Internal server error - Something went wrong on the server.
 */
// Route for uploading files
router.post("/", upload.single("file"), function (req, res) {
    // Convert Windows paths to valid paths
    const filePath = req.file.path.replace(/\\/g, "/");
    // Log the path of the uploaded file
    console.log("router.post(/file: " + base + "/" + filePath);
    // Send a response with the URL of the uploaded file
    res.status(200).send({ url: base + "/" + filePath });
});
module.exports = router;
