import escpos from "escpos";
import USB from "escpos-usb";

let device: any;
let printer: escpos.Printer;

export function initPrinter() {
    console.log("Connecting to printer...");
    try {
        device = new USB(0x04b8, 0x0e20);
        printer = new escpos.Printer(device);
        console.log("Printer connected.");
    } catch (error) {
        console.log("Error finding printer.");
    }
}

export function printText(text: string) {
    let ran = false;
    device.open(() => {
        if (!ran) {
            printer
                .align("CT")
                .style("NORMAL")
                .text(text)
                .feed(5)
                .cut()
                .close();
            ran = true;
        }
    });
}

export function printReceipt(receipt: Receipt) {
    let ran = false;
    if (!device) {
        console.log("No print device connected. Trying to connect");
        initPrinter();
        if (!device) {
            console.log("Still couldn't connect.");
            return ran;
        }
    }
    device.open(() => {
        if (!ran) {
            for (let i = 0; i < 2; i++) {
                printer
                    .align("CT")
                    .style("BU")
                    .size(2, 2)
                    .text(receipt.number.toString())
                    .feed(3)
                    .style("B")
                    .size(1, 1)
                    .align("LT")
                    .text(receipt.content)
                    .feed(5)
                    .cut();
            }
            printer.close();
            ran = true;
        }
    });
    return ran;
}
