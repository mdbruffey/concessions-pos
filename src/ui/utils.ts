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