import { app, ipcMain } from "electron";
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

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (
        ...[event, payload]: EventPayloadMapping[Key]["request"] extends undefined
            ? []
            : [event: Electron.IpcMainInvokeEvent, payload: EventPayloadMapping[Key]["request"]]
    ) => EventPayloadMapping[Key]['response']
) {
    //I'm casting as any here because TS can't resolve the conditional tuple down to the 
    //expected shape. ChatGPT seems to think this is legitimate. I'm not so sure, but I don't
    //any better...
    ipcMain.handle(key, handler as any); 
}
