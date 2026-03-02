export function timestampToSessionDate(timestamp: string) {
    let date = new Date(timestamp);
    let options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
}

export function isProduct(item: unknown){
    return (
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        "type" in item &&
        "combo_option_type" in item &&
        "default_price" in item &&
        "image_path" in item &&
        "active" in item
    )
}

export function generateReceipt(sale: Sale, products: Product[], combos: Combo[]){
    let number = 1
    if(sale.id) number = sale.id % 99 + 1
    let content = ""
    for (let item of sale.items){
        if(item.product_id){
            content += `${item.quantity}x ${products.filter((p) => p.id === item.product_id)[0].name}\n`
        }
        else{{
            content += `${item.quantity}x ${combos.filter((c) => c.id ===item.combo_id)[0].name}\n`
            for (let ci of item.combo_items){
                content += `\t${ci.quantity}x ${products.filter((p) => p.id === ci.product_id)[0].name}\n`
            }
        }}
    }
    return {number: number, content: content} as Receipt
}