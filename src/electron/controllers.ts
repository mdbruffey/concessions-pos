import db from "./database/db.js";

export function getProducts(): Product[] {
    const allProducts = db.prepare<[],Product>("SELECT * from products");
    const products = allProducts.all();
    if (products.length === 0) {
        const entry = db.prepare(
            "INSERT into products (name, type, default_price) VALUES(?,?,?)"
        );
        entry.run("Hotdog", "Hot", 2.0);
    }
    return products;
}

export function getCombos(): Combo[] {
    const stmt = db.prepare<[], Combo>("SELECT * from combos");
    const combos = stmt.all();
    return combos;
}

export function authenticatePIN(pin: number): User | undefined {
    const stmt = db.prepare<number, User>("SELECT * FROM users WHERE pin = ?");
    const user = stmt.get(pin);
    return user;
}

/**
 *
 * @param request  An object containing a user object and description of the session
 * \{
 *      user: USER,
 *      description: string
 * \}
 * @returns The new session object or current session if one is already active
 */
export function startSession(request: StartSessionRequest): Session {
    const startTime = new Date();
    const getCurrentSession = db.prepare<[], Session>(
        "SELECT * FROM sessions where end IS NULL"
    );
    const currentSession = getCurrentSession.get();
    if (currentSession) {
        return currentSession;
    }
    const insertNewSession = db.prepare<[string, number, string], Session>(
        "INSERT INTO sessions (start, started_by, description) VALUES (?,?,?) RETURNING *"
    );
    const newSession = insertNewSession.get(
        startTime.toDateString(),
        request.user.id,
        request.description
    );
    if(!newSession){
        throw new Error("Failed to create a session");
    }
    return newSession;
}

/**
 * Concludes the current session by adding an end time to the entry and
 * the id of the user who ended it.
 * @param user User object of user ending the session
 * @returns The completed session object
 */
export function endSession(user: User): Session {
    const endTime = new Date();
    const setCurrentSessionEnd = db.prepare<[string, number], Session>(
        "UPDATE sessions SET end = ?, ended_by = ? where end IS NULL RETURNING *"
    );
    const currentSession = setCurrentSessionEnd.get(
        endTime.toDateString(),
        user.id
    );
    if (!currentSession) {
        throw new Error("No active session...");
    }
    return currentSession;
}

export function createSale(sale: Sale): number {
    const insertSaleStmt = db.prepare("INSERT INTO sales VALUES(?,?,?)");
    const insertSaleItemStmt = db.prepare(
        "INSERT INTO sale_items VALUES(?,?,?,?,?,?,?)"
    );

    const createSaleTransaction = db.transaction((sale: Sale) => {
        const result = insertSaleStmt.run(
            sale.total,
            sale.user_id,
            sale.time
        );
        const saleId = result.lastInsertRowid as number;
        for (let item of sale.items) {
            insertSaleItemStmt.run(
                saleId,
                item.product_id,
                item.combo_id,
                item.quantity,
                item.sale_price,
                item.price_modified,
                item.price_modified_by
            );
        }
        return saleId;
    });

    return createSaleTransaction(sale);
}
