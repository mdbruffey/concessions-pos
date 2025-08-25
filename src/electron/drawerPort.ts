import { SerialPort } from "serialport";

const port = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 9600 });
export default port;
