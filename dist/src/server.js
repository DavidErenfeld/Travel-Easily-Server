"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
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
http_1.default.createServer(app_1.default).listen(process.env.PORT || 3000, () => {
    console.log(`Server running in development on https://enigmatic-island-56921-258869278475.herokuapp.com/${process.env.PORT || 3000}`);
});
//# sourceMappingURL=server.js.map