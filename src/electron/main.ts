import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandle, isDev } from "./utils.js";
import database from "./database/db.js";
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCombos,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    authenticatePIN,
    startSession,
    endSession,
    startShift,
    endShift,
    createSale,
    openDrawer,
} from "./controllers.js";

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

    ipcMainHandle("getProducts", () => getProducts());
    ipcMainHandle("addProduct", (_, request) => addProduct(request));
    ipcMainHandle("updateProduct", (_, request) => updateProduct(request));
    ipcMainHandle("deleteProduct", (_, request) => deleteProduct(request));
    ipcMainHandle("getCombos", () => getCombos());
    ipcMainHandle("getUsers", (_, user) => getUsers(user));
    ipcMainHandle("addUser", (_, request) => addUser(request));
    ipcMainHandle("updateUser", (_, request) => updateUser(request));
    ipcMainHandle("deleteUser", (_, request) => deleteUser(request));
    ipcMainHandle("authenticatePIN", (_, pin) => authenticatePIN(pin));
    ipcMainHandle("startSession", (_, request) => startSession(request));
    ipcMainHandle("endSession", (_, user) => endSession(user));
    ipcMainHandle("startShift", (_, user) => startShift(user));
    ipcMainHandle("endShift", (_, user) => endShift(user));
    ipcMainHandle("createSale", (_, sale) => createSale(sale));
    ipcMainHandle("openDrawer", () => openDrawer());
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
        endShift(user);
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
        endSession(user);
    }
    try {
        db.close();
        console.log("Database closed.");
    } catch (error) {
        console.error("Error closing database", error);
    }
});
