import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import database from "./database/db.js";

const db = database;

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(app.getAppPath(), "/dist-electron/preload.cjs"),
        },
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
    } else {
        mainWindow.loadFile(
            path.join(app.getAppPath(), "/dist-react/index.html")
        );
    }
    console.log(db.open);
});

app.on("before-quit", () => {
    try {
        db.close();
        console.log("Database closed.");
    } catch (error) {
        console.error("Error closing database", error);
    }
});
