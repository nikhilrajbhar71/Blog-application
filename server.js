import app from "./app.js";
import { dbConnection } from "./src/config/db.js";
import { syncDatabase } from "./src/models/index.js";
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await dbConnection().then(() => syncDatabase());
  console.log(`Server running on port ${PORT}`);
});
