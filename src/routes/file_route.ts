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
