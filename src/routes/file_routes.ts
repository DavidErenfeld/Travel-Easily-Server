import express from "express";
const router = express.Router();
import multer from "multer";

// הגדרת ה-URL הבסיסי לשרת
const base = "http://localhost:3000";

// הגדרת אחסון ל- multer
const storage = multer.diskStorage({
  // פונקציה שמגדירה את יעד שמירת הקבצים
  destination: function (req, file, cb) {
    cb(null, "public/"); // שמירת הקבצים בתיקייה 'public/'
  },
  // פונקציה שמגדירה את שם הקובץ
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
    cb(null, Date.now() + "." + ext); // שימוש בתג הזמן כדי ליצור שם קובץ ייחודי
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
