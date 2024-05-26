import app from "./app";
import http from "http";

http.createServer(app).listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running in development on https://enigmatic-island-56921-258869278475.herokuapp.com/${
      process.env.PORT || 3000
    }`
  );
});
