import db from "./database/db.js";

export function getProducts(): Product[] {
    const allProducts = db.prepare("SELECT * from products");
    const products = allProducts.all() as Product[];
    if (products.length === 0) {
        const entry = db.prepare(
            "INSERT into products (name, type, default_price) VALUES(?,?,?)"
        );
        entry.run("Hotdog", "Hot", 2.00);
    }
    return products;
}

export function getCombos(): Combo[] {
    const stmt = db.prepare("SELECT * from combos");
    const combos = stmt.all() as Combo[];
    return combos;
}