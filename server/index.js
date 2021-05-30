const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

(async () => {
  // open the database
  const db = await open({
    filename: "/tmp/database.db",
    driver: sqlite3.Database,
  });
  console.log("DB", db);
})();
