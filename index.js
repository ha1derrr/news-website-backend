import app from "./app.js";
import connectDB from "./config/db.js";
import "dotenv/config";
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
