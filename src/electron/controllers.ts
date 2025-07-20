import db from "./database/db.js";

export function getProducts(): Product[] {
    const allProducts = db.prepare("SELECT * from products");
    const products = allProducts.all() as Product[];
    if (products.length === 0) {
        const entry = db.prepare(
            "INSERT into products (name, type, default_price) VALUES(?,?,?)"
        );
        entry.run("Hotdog", "Hot", 2.0);
    }
    return products;
}

export function getCombos(): Combo[] {
    const stmt = db.prepare("SELECT * from combos");
    const combos = stmt.all() as Combo[]; //This does not work as intended, lol
    return combos;
}

export function authenticatePIN(pin: number): User {
    const stmt = db.prepare("SELECT * FROM users WHERE pin = ?");
    const user = stmt.get(pin) as User;
    return user;
}
