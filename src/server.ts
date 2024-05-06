import app from "./app";
import fs from "fs";
import https from "https";
import http from "http";

// if (process.env.NODE_ENV === "production") {
//   const httpsOptions = {
//     key: fs.readFileSync(process.env.SSL_KEY_PATH),
//     cert: fs.readFileSync(process.env.SSL_CERT_PATH),
//   };
//   https.createServer(httpsOptions, app).listen(process.env.HTTPS_PORT, () => {
//     console.log(
//       `Server running in production on https://enigmatic-island-56921-258869278475.herokuapp.com/${process.env.HTTPS_PORT}`
//     );
//   });
// } else {
http.createServer(app).listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running in development on https://enigmatic-island-56921-258869278475.herokuapp.com/${
      process.env.PORT || 3000
    }`
  );
});
