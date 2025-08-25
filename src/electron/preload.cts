import electron from "electron";

electron.contextBridge.exposeInMainWorld("electron", {
    getProducts: () => ipcInvoke("getProducts"),
    addProduct: (request) => ipcInvoke("addProduct", request),
    updateProduct: (request) => ipcInvoke("updateProduct", request),
    deleteProduct: (request) => ipcInvoke("deleteProduct", request),
    getCombos: () => ipcInvoke("getCombos"),
    getUsers: (user) => ipcInvoke("getUsers", user),
    addUser: (request) => ipcInvoke("addUser", request),
    updateUser: (request) => ipcInvoke("updateUser", request),
    deleteUser: (request) => ipcInvoke("deleteUser", request),
    authenticatePIN: (pin) => ipcInvoke("authenticatePIN", pin),
    startSession: (request) => ipcInvoke("startSession", request),
    endSession: (user) => ipcInvoke("endSession", user),
    startShift: (user) => ipcInvoke("startShift", user),
    endShift: (user) => ipcInvoke("endShift", user),
    createSale: (sale) => ipcInvoke("createSale", sale),
    openDrawer: () => ipcInvoke("openDrawer"),
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    ...[key, payload]: EventPayloadMapping[Key]["request"] extends undefined
        ? [key: Key]
        : [key: Key, payload: EventPayloadMapping[Key]["request"]]
): Promise<EventPayloadMapping[Key]["response"]> {
    return electron.ipcRenderer.invoke(key, payload);
}
