import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandle, isDev } from "./utils.js";
import database from "./database/db.js";
import * as api from "./controllers.js";

const db = database;
let width = 2560;
let height = 1440;

if (isDev()) {
    width = 1707;
    height = 960;
}

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: width,
        height: height,
        resizable: false,
        webPreferences: {
            preload: path.join(app.getAppPath(), "/dist-electron/preload.cjs"),
        },
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
    } else {
        mainWindow.setFullScreen(true);
        mainWindow.loadFile(
            path.join(app.getAppPath(), "/dist-react/index.html")
        );
    }
    //Product Handling
    ipcMainHandle("getProducts", () => api.getProducts());
    ipcMainHandle("addProduct", (_, request) => api.addProduct(request));
    ipcMainHandle("updateProduct", (_, request) => api.updateProduct(request));
    ipcMainHandle("deleteProduct", (_, request) => api.deleteProduct(request));

    //Combo Handling
    ipcMainHandle("getCombos", () => api.getCombos());
    ipcMainHandle("addCombo", (_, request) => api.addCombo(request));
    ipcMainHandle("updateCombo", (_, request) => api.updateCombo(request));

    //User Handling
    ipcMainHandle("getUsers", (_, user) => api.getUsers(user));
    ipcMainHandle("addUser", (_, request) => api.addUser(request));
    ipcMainHandle("updateUser", (_, request) => api.updateUser(request));
    ipcMainHandle("deleteUser", (_, request) => api.deleteUser(request));

    //Session Handling
    ipcMainHandle("authenticatePIN", (_, pin) => api.authenticatePIN(pin));
    ipcMainHandle("startSession", (_, request) => api.startSession(request));
    ipcMainHandle("endSession", (_, user) => api.endSession(user));
    ipcMainHandle("startShift", (_, user) => api.startShift(user));
    ipcMainHandle("endShift", (_, user) => api.endShift(user));
    ipcMainHandle("createSale", (_, sale) => api.createSale(sale));
    ipcMainHandle("openDrawer", () => api.openDrawer());

    //Report Handling
    ipcMainHandle("getSessions", () => api.getSessions());
    ipcMainHandle("getSalesBySession", (_, id) => api.getSalesBySession(id));
});

app.on("before-quit", () => {
    const getActiveShifts = db.prepare<[], Shift>(
        "SELECT * FROM shifts WHERE end IS NULL"
    );
    const activeShifts = getActiveShifts.all();
    for (let shift of activeShifts) {
        const getUser = db.prepare<[number], User>(
            "SELECT * FROM users where id = ?"
        );
        const user = getUser.get(shift.user_id);
        if (!user)
            throw new Error(
                "Somehow there is an active shift for a non-existing user????"
            );
        api.endShift(user);
    }

    const getActiveSession = db.prepare<[], Session>(
        "SELECT * FROM sessions WHERE end IS NULL"
    );
    const activeSession = getActiveSession.get();
    if (activeSession) {
        const getUser = db.prepare<[number], User>(
            "SELECT * FROM users where id = ?"
        );
        const user = getUser.get(activeShifts[0].user_id);
        if (!user) throw new Error("No user available to end session??");
        api.endSession(user);
    }
    try {
        db.close();
        console.log("Database closed.");
    } catch (error) {
        console.error("Error closing database", error);
    }
});
