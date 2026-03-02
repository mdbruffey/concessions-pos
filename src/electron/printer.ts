import escpos from "escpos";
import USB from "escpos-usb";

let device: any;
let printer: escpos.Printer;

function getPrinter(){
    try{
        device = new USB();
        printer = new escpos.Printer(device);
    }
    catch(error) {console.log("Error finding printer.")}
}

getPrinter();

export function printText(text: string) {
    let ran = false
    device.open(() => {
        if (!ran){
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
};

export function printReceipt(receipt: Receipt){
    let ran = false
    if(!device) {
        console.log("No print device connected. Trying to connect")
        getPrinter()
        if(!device){
            console.log("Still couldn't connect.")
            return ran
        }
    }
    device.open(() => {
        if (!ran){
            for (let i = 0; i < 2; i++){
                printer
                    .align("CT")
                    .style("BU")
                    .size(2,2)
                    .text(receipt.number.toString())
                    .feed(3)
                    .style("B")
                    .size(1,1)
                    .align("LT")
                    .text(receipt.content)
                    .feed(5)
                    .cut()
            }
            printer.close()            
            ran = true;
        }
    });
    return ran;
}
