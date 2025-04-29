import app from "./app.js";
import connectToMongoDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
