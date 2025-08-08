import db from "./database/db.js";

export function getProducts(): Product[] {
    const allProducts = db.prepare<[], Product>("SELECT * from products");
    const products = allProducts.all();
    return products;
}

export function getCombos(): Combo[] {
    const stmt = db.prepare<[], Combo>("SELECT * from combos");
    const combos = stmt.all();
    return combos;
}

export function authenticatePIN(pin: string): User | undefined {
    const stmt = db.prepare<string, User>("SELECT * FROM users WHERE pin = ?");
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
        startTime.toISOString(),
        request.user.id,
        request.description
    );
    if (!newSession) {
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
        endTime.toISOString(),
        user.id
    );
    if (!currentSession) {
        throw new Error("No active session...");
    }
    return currentSession;
}

export function startShift(user: User): Shift {
    const startTime = new Date();
    const getSession = db.prepare<[], {id: number}>(
        "SELECT id from sessions WHERE end IS NULL"
    );
    const currentSessionId = getSession.get();
    if (!currentSessionId) throw new Error("No active session.");

    const getCurrentShift = db.prepare<[number, number], Shift>(
        "SELECT * FROM shifts WHERE session_id = ? AND user_id = ? AND end IS NULL"
    );
    const currentShift = getCurrentShift.get(currentSessionId.id, user.id);
    if (currentShift) return currentShift;

    const insertShift = db.prepare<[number, number, string], Shift>(
        "INSERT INTO shifts (user_id, session_id, start) VALUES(?,?,?) RETURNING *"
    );
    const newShift = insertShift.get(
        user.id,
        currentSessionId.id,
        startTime.toISOString()
    );
    if (!newShift) throw new Error("Failed to create new shift.");
    return newShift;
}

export function endShift(user: User): Shift {
    const endTime = new Date();
    const getSession = db.prepare<[], {id: number}>(
        "SELECT id from sessions WHERE end IS NULL"
    );
    const currentSessionId = getSession.get();
    if (!currentSessionId) throw new Error("No active session.");

    const setCurrentShiftEnd = db.prepare<[string, number, number], Shift>(
        "UPDATE shifts SET end = ? WHERE session_id = ? and user_id = ? and end IS NULL RETURNING *"
    );
    const endedShift = setCurrentShiftEnd.get(
        endTime.toISOString(),
        currentSessionId.id,
        user.id
    );
    if (!endedShift) throw new Error("No active shift...");
    return endedShift;
}

export function createSale(sale: Sale): number {
    const insertSaleStmt = db.prepare("INSERT INTO sales (total, user_id, time) VALUES(?,?,?)");
    const insertSaleItemStmt = db.prepare(
        "INSERT INTO sale_items VALUES(NULL,?,?,?,?,?,?,?)"
    );

    const createSaleTransaction = db.transaction((sale: Sale) => {
        const result = insertSaleStmt.run(sale.total, sale.user_id, sale.time);
        const saleId = result.lastInsertRowid as number;
        for (let item of sale.items) {
            insertSaleItemStmt.run(
                saleId,
                item.product_id,
                item.combo_id,
                item.quantity,
                item.sale_price,
                item.price_modified ? 1 : 0,
                item.price_modified_by
            );
        }
        return saleId;
    });

    return createSaleTransaction(sale);
}
