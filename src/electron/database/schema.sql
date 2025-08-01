CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    pin INTEGER
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    default_price REAL NOT NULL,
    image_path TEXT
);

CREATE TABLE IF NOT EXISTS combos (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    default_price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS combo_items (
    combo_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (combo_id, product_id),
    FOREIGN KEY (combo_id) REFERENCES combos(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY,
    total REAL NOT NULL,
    user_id INTEGER NOT NULL,
    time TEXT NOT NULL, --timestamp
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY,
    sale_id INTEGER NOT NULL,
    product_id INTEGER, --Null if item is a combo
    combo_id INTEGER,   --Null if item is normal product
    quantity INTEGER NOT NULL DEFAULT 1,
    sale_price REAL NOT NULL,
    price_modified INTEGER NOT NULL DEFAULT 0, --consider as a boolean
    price_modified_by INTEGER, --null if not changed
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (combo_id) REFERENCES combos(id),
    FOREIGN KEY (price_modified_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    start TEXT NOT NULL, --timestamp
    started_by INTEGER NOT NULL,
    end TEXT, --timestamp
    ended_by INTEGER,
    description TEXT, --optional
    FOREIGN KEY (started_by) REFERENCES users(id),
    FOREIGN KEY (ended_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS session_sales (
    session_id INTEGER NOT NULL,
    sale_id INTEGER NOT NULL,
    PRIMARY KEY (session_id, sale_id),
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    start TEXT NOT NULL,
    end TEXT, --begins null, updated to timestamp when shift ends
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);