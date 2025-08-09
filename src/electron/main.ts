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
    startShift,
    endShift,
    createSale,
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
    ipcMainHandle("startShift", (_, user) => startShift(user));
    ipcMainHandle("endShift", (_, user) => endShift(user));
    ipcMainHandle("createSale", (_, sale) => createSale(sale));
});

app.on("before-quit", () => {
    const getActiveShifts = db.prepare<[], Shift>("SELECT * FROM shifts WHERE end IS NULL");
    const activeShifts = getActiveShifts.all();
    for (let shift of activeShifts){
        const getUser = db.prepare<[number], User>("SELECT * FROM users where id = ?");
        const user = getUser.get(shift.user_id);
        if(!user) throw new Error("Somehow there is an active shift for a non-existing user????");
        endShift(user);
    }

    const getActiveSession = db.prepare<[], Session>("SELECT * FROM sessions WHERE end IS NULL");
    const activeSession = getActiveSession.get();
    if(activeSession){
        const getUser = db.prepare<[number], User>("SELECT * FROM users where id = ?");
        const user = getUser.get(activeShifts[0].user_id);
        if(!user) throw new Error("No user available to end session??")
        endSession(user);
    }
    try {
        db.close();
        console.log("Database closed.");
    } catch (error) {
        console.error("Error closing database", error);
    }
});
