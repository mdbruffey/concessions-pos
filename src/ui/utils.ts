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