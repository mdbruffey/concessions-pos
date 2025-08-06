import { app } from "electron";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Database as Sqlite3Database } from "better-sqlite3";
import { getDbPath } from "../utils.js";

const dbPath = getDbPath();
const dbExists = fs.existsSync(dbPath);
const db: Sqlite3Database = new Database(getDbPath());
if (!dbExists) {
    console.log("Running db initialization");
    const schema = fs.readFileSync(
        path.join(app.getAppPath(), "/src/electron/database/schema.sql"),
        "utf-8"
    );
    db.exec(schema);
}

export default db;
