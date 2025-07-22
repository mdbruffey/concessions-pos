import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandle, isDev } from "./utils.js";
import database from "./database/db.js";
import {
    getProducts,
    getCombos,
    authenticatePIN,
    startSession,
    endSession,
    createSale
} from "./controllers.js";

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

    ipcMainHandle("getProducts", () => getProducts());
    ipcMainHandle("getCombos", () => getCombos());
    ipcMainHandle("authenticatePIN", (_, pin) => authenticatePIN(pin));
    ipcMainHandle("startSession", (_, request) => startSession(request));
    ipcMainHandle("endSession", (_, user) => endSession(user));
    ipcMainHandle("createSale", (_, sale) => createSale(sale));
});

app.on("before-quit", () => {
    try {
        db.close();
        console.log("Database closed.");
    } catch (error) {
        console.error("Error closing database", error);
    }
});
