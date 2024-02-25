import express from "express";
const router = express.Router();
import multer from "multer";

// הגדרת ה-URL הבסיסי לשרת
const base = "http://localhost:3000";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const date = new Date();
    const formattedDate = date
      .toISOString()
      .replace(/:/g, "-") // מחליף נקודותיים במקף כדי להימנע מבעיות בשמות קבצים
      .replace(/\..+$/, ""); // מסיר את החלק של המילישניות ו-Z
    cb(null, formattedDate + "." + ext);
  },
});

const upload = multer({ storage: storage });

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





// נתיב להעלאת קבצים
router.post("/", upload.single("file"), function (req, res) {
  // המרה של נתיבי חלונות לנתיבים תקניים
  const filePath = req.file.path.replace(/\\/g, "/");

  // הדפסת הנתיב של הקובץ המועלה
  console.log("router.post(/file: " + base + "/" + filePath);

  // שליחת תגובה עם ה-URL של הקובץ המועלה
  res.status(200).send({ url: base + "/" + filePath });
});

export = router;
