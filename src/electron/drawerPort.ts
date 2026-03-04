import { SerialPort } from "serialport";

let port: SerialPort | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

export function initDrawer() {
    connect();
}

function connect(path = "/dev/ttyUSB0", baudRate = 9600) {
    console.log("Attempting to connect to drawer.")
    port = new SerialPort({ path: path, baudRate: baudRate, autoOpen: false });

    port.open((err) => {
        if (err) {
            console.log("Failed to open drawer port. Retrying...");
            scheduleReconnect();
            return;
        }
        console.log("Drawer connected.");
    });

    port.on("close", () => {
        console.log("Drawer disconnected. Attempting reconnect...");
        cleanup();
        scheduleReconnect();
    });
}

function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
    }, 2000);
}

function cleanup() {
    if (port) {
        port.removeAllListeners();
        port = null;
    }
}

export function sendOpen() {
    if (!port?.isOpen) {
        console.warn("Drawer is not connected.")
        return false;
    };
    port.write(Buffer.from([0x07]), (err) => {
        if (err) {
            console.error("Failed to open drawer", err);
            return false;
        }
    })
    return true;
}
