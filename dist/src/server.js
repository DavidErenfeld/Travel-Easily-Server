"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
if (process.env.NODE_ENV === "production") {
    const httpsOptions = {
        key: fs_1.default.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs_1.default.readFileSync(process.env.SSL_CERT_PATH),
    };
    https_1.default.createServer(httpsOptions, app_1.default).listen(process.env.HTTPS_PORT, () => {
        console.log(`Server running in production on https://localhost:${process.env.HTTPS_PORT}`);
    });
}
else {
    http_1.default.createServer(app_1.default).listen(process.env.PORT || 3000, () => {
        console.log(`Server running in development on http://localhost:${process.env.PORT || 3000}`);
    });
}
//# sourceMappingURL=server.js.map