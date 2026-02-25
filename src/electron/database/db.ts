import { app } from "electron";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Database as Sqlite3Database } from "better-sqlite3";
import { getDbPath } from "../utils.js";
import { products, combos, users } from "./seedData.js";

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

    const insertProduct = db.prepare(
        "INSERT INTO products (name, type, combo_option_type, default_price, image_path) VALUES(@name, @type, @combo_option_type, @default_price, @image_path)"
    );
    const insertManyProducts = db.transaction((products) => {
        for (const product of products) insertProduct.run(product);
    });
    insertManyProducts(products);

    const insertCombo = db.prepare(
        "INSERT INTO combos (name, default_price, main_item_type, main_item_quantity) VALUES(@name, @default_price, @main_item_type, @main_item_quantity)"
    );
    const insertManyCombos = db.transaction((combos) => {
        for (const combo of combos) insertCombo.run(combo);
    });
    insertManyCombos(combos);

    const insertUser = db.prepare(
        "INSERT INTO users (username, first_name, last_name, pin) VALUES(@username, @first_name, @last_name, @pin)"
    );
    const insertManyUsers = db.transaction((users) => {
        for (const user of users) insertUser.run(user);
    });
    insertManyUsers(users);
}
const test = db.prepare("SELECT * FROM products");
const test_results = test.all();
console.log(`${test_results.length} products in database`);

//Database Updates
//Check if "active" column exists in combos table
const combo_col_data = db.pragma("table_info('combos')")
if(!((combo_col_data as Array<any>).map((i) => i.name).includes("active"))){
    console.log((combo_col_data as Array<any>).map((i) => i.name))
    db.exec("ALTER TABLE combos ADD COLUMN active INTEGER DEFAULT(1)");
    console.log("Added column");
}
else{
    console.log("combos table already updated")
}

export default db;
