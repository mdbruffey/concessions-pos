import { app } from "electron";
import path from "path";

export function isDev() {
    return process.env.NODE_ENV === "development";
}

export function getDbPath() {
    if (isDev()) {
        return path.join(app.getAppPath() + "/src/electron/database/dev.db");
    }
    return path.join(app.getPath("appData"), "pos.db");
}
