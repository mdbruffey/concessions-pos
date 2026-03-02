import { SerialPort } from "serialport";

let port: SerialPort;

function createPort(path = "/dev/ttyUSB0", baudRate = 9600) {
    port = new SerialPort({ path: path, baudRate: baudRate }, (error) => console.log(error));
}

function getPort() {
    if (port && port.isOpen) {
        return port;
    }
    createPort();
    return port;
}

export default getPort;
