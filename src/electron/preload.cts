import electron from "electron";

electron.contextBridge.exposeInMainWorld("electron", {
    getProducts: () => ipcInvoke("getProducts"),
    getCombos: () => ipcInvoke("getCombos"),
    authenticatePIN: (pin) => ipcInvoke("authenticatePIN", pin),
    startSession: (request) => ipcInvoke("startSession", request),
    endSession: (user) => ipcInvoke("endSession", user),
    createSale: (sale) => ipcInvoke("createSale", sale),
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    ...[key, payload]: EventPayloadMapping[Key]["request"] extends undefined
        ? [key: Key]
        : [key: Key, payload: EventPayloadMapping[Key]["request"]]
): Promise<EventPayloadMapping[Key]["response"]> {
    return electron.ipcRenderer.invoke(key, payload);
}
