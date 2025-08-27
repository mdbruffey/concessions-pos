import db from "./database/db.js";
import port from "./drawerPort.js";

export function getProducts(): Product[] {
    const allProducts = db.prepare<[], Product>("SELECT * from products");
    const products = allProducts.all();
    return products;
}

export function addProduct(request: ProductRequest): Product | null {
    const product = request.product;
    const addProductStmt = db.prepare<
        [string, string, string, number, string | null],
        Product
    >(
        "INSERT INTO products (name, type combo_option_type, default_price, image_path VALUES(?,?,?,?,?) RETURNING *"
    );
    const newProduct = addProductStmt.get(
        product.name,
        product.type,
        product.combo_option_type,
        product.default_price,
        product.image_path
    );
    if (newProduct) return newProduct;
    return null;
}
export function updateProduct(request: ProductRequest): Product | null {
    const product = request.product;
    const addProductStmt = db.prepare<
        [string, string, string, number, string | null],
        Product
    >(
        "UPDATE products SET name = ?, type = ? combo_option_type = ?, default_price = ?, image_path = ? RETURNING *"
    );
    const updatedProduct = addProductStmt.get(
        product.name,
        product.type,
        product.combo_option_type,
        product.default_price,
        product.image_path
    );
    if (updatedProduct) return updatedProduct;
    return null;
}
export function deleteProduct(request: ProductRequest): Product | null {
    const product = request.product;
    const deleteProductStmt = db.prepare<[number], Product>(
        "DELETE FROM products WHERE id = ? RETURNING *"
    );
    const newProduct = deleteProductStmt.get(product.id);
    if (newProduct) return newProduct;
    return null;
}

export function getCombos(): Combo[] {
    const stmt = db.prepare<[], Combo>("SELECT * from combos");
    const combos = stmt.all();
    return combos;
}

export function getUsers(user: User): User[] {
    if (!(user.id === 1)) return [];
    const getUsersStmt = db.prepare<[], User>("SELECT * from users");
    const users = getUsersStmt.all();
    return users;
}

export function addUser(request: UserRequest): User | null {
    if (!(request.authenticatingUser.id === 1)) return null;
    const userObject = request.userObject;
    const addUserStmt = db.prepare<[string, string, string, string], User>(
        "INSERT INTO users(username, first_name, last_name, pin) VALUES(?,?,?,?) RETURNING *"
    );
    const newUser = addUserStmt.get(
        userObject.username,
        userObject.first_name,
        userObject.last_name,
        userObject.pin
    );
    if (newUser) return newUser;
    return null;
}
export function updateUser(request: UserRequest): User | null {
    if (!(request.authenticatingUser.id === 1)) return null;
    const userObject = request.userObject;
    const updateUserStmt = db.prepare<
        [string, string, string, string, number],
        User
    >(
        "UPDATE users SET username = ?, first_name = ?, last_name = ?, pin = ? WHERE id = ? RETURNING *"
    );
    const updatedUser = updateUserStmt.get(
        userObject.username,
        userObject.first_name,
        userObject.last_name,
        userObject.pin,
        userObject.id
    );
    if (updatedUser) return updatedUser;
    return null;
}

export function deleteUser(request: UserRequest): User | null {
    if (!(request.authenticatingUser.id === 1)) return null;
    const delUserStmt = db.prepare<[number], User>(
        "DELETE FROM users WHERE id=? RETURNING *"
    );
    const deletedUser = delUserStmt.get(request.userObject.id);
    if (deletedUser) return deletedUser;
    return null;
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
    const getSession = db.prepare<[], { id: number }>(
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
    const getSession = db.prepare<[], { id: number }>(
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
    const insertSaleStmt = db.prepare(
        "INSERT INTO sales (total, payment_type, user_id, time) VALUES(?,?,?,?)"
    );
    const insertComboSelectionStmt = db.prepare(
        "INSERT INTO combo_selections (sale_item_id, product_id, option_type, quantity) VALUES(?,?,?,?)"
    );
    const insertSaleItemStmt = db.prepare(
        "INSERT INTO sale_items VALUES(NULL,?,?,?,?,?,?,?) RETURNING id"
    );
    const getCurrentSession = db.prepare<[], Session>(
        "SELECT * FROM sessions where end IS NULL"
    );
    const currentSession = getCurrentSession.get();
    const insertSessionSaleStmt = db.prepare(
        "INSERT INTO session_sales VALUES(?,?)"
    );

    const createSaleTransaction = db.transaction((sale: Sale) => {
        const result = insertSaleStmt.run(sale.total, sale.payment_type, sale.user_id, sale.time);
        const saleId = result.lastInsertRowid as number;
        for (let item of sale.items) {
            const sale_item_id = insertSaleItemStmt.run(
                saleId,
                item.product_id,
                item.combo_id,
                item.quantity,
                item.sale_price,
                item.price_modified ? 1 : 0,
                item.price_modified_by
            ).lastInsertRowid as number;
            if (item.combo_items.length) {
                for (let i of item.combo_items) {
                    insertComboSelectionStmt.run(
                        sale_item_id,
                        i.product_id,
                        i.option_type,
                        i.quantity
                    );
                }
            }
        }
        if(!currentSession) throw new Error("No existing session...")
        insertSessionSaleStmt.run(currentSession.id, saleId);
        return saleId;
    });

    return createSaleTransaction(sale);
}

export function openDrawer(): boolean {
    port.write(Buffer.from([0x07]), (err) => {
        if (err) {
            console.error("Failed to open drawer", err);
            return false;
        }
    });
    console.log("Drawer triggered");
    return true;
}
