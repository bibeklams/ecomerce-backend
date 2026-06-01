import app from "./app.js";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3001;

connectDb();

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
