type Page = "sale" | "manage" | "reports";

type User = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    pin: string;
};

type Product = {
    id: number;
    name: string;
    type: string;
    combo_option_type: string;
    default_price: number;
    image_path: string | null;
    active: number; //should just be 0 or 1
};

type Combo = {
    id: number;
    name: string;
    main_item_type: string;
    main_item_quantity: number;
    default_price: number;
    active: number; //0 | 1
}

type Sale = {
    id?: number;
    total: number;
    payment_type?: "cash" | "card" | "tab";
    user_id: number;
    time: string;
    items: SaleItem[];
};

type SaleItem = {
    id?: number;
    sale_id?: number;
    product_id: number | null;
    combo_id: number | null;
    quantity: number;
    sale_price: number;
    price_modified: boolean;
    price_modified_by: number | null;
    combo_items: ComboItem[]
};

type ComboItem = {
    product_id: number;
    option_type: string;
    quantity: number;
}

type Session = {
    id?: number;
    start: string;
    started_by: number;
    end: string | null;
    ended_by: number | null;
    description: string | null;
    sales: Sale[];
};

type Shift = {
    id?: number;
    user_id: number;
    session_id: number;
    start: string;
    end: string | null;
}

/**Request object for starting a new session */
type StartSessionRequest = {
    user: User;
    description: string;
};

type ProductRequest = {
    product: Product;
    user: User;
}

type ComboRequest = {
    combo: Combo;
    user: User;
}

type UserRequest = {
    userObject: User;
    authenticatingUser: User;
}

type EventPayloadMapping = {
    getProducts: {
        request: undefined;
        response: Product[];
    };
    addProduct: {
        request: ProductRequest;
        response: Product | null;
    };
    updateProduct: {
        request: ProductRequest;
        response: Product | null;
    };
    deleteProduct: {
        request: ProductRequest;
        response: Product | null;
    };
    getCombos: {
        request: undefined;
        response: Combo[];
    };
    addCombo: {
        request: ComboRequest;
        response: Combo | null;
    };
    updateCombo: {
        request: ComboRequest;
        response: Combo | null;
    };
    deleteCombo: {
        request: ComboRequest;
        response: Combo | null;
    };
    getUsers: {
        request: User;
        response: User[];
    };
    addUser: {
        request: UserRequest;
        response: User | null;
    };
    updateUser: {
        request: UserRequest;
        response: User | null;
    };
    deleteUser: {
        request: UserRequest;
        response: User | null;
    };
    authenticatePIN: {
        request: string;
        response: User | undefined;
    };
    startSession: {
        request: StartSessionRequest;
        response: Session;
    };
    endSession: {
        request: User;
        response: Session;
    };
    startShift: {
        request: User;
        response: Shift;
    };
    endShift: {
        request: User;
        response: Shift;
    };
    createSale: {
        request: Sale;
        response: number;
    };
    openDrawer: {
        request: undefined;
        response: boolean;
    }
    getSessions: {
        request: undefined;
        response: Session[];
    }
    getSalesBySession: {
        request: number;
        response: Sale[];
    }
};

interface Window {
    electron: {
        getProducts: () => Promise<Product[]>;
        addProduct: (request: ProductRequest) => Promise<Product | null>;
        updateProduct: (request: ProductRequest) => Promise<Product | null>;
        deleteProduct: (request: ProductRequest) => Promise<Product | null>;
        getCombos: () => Promise<Combo[]>;
        addCombo: (request: ComboRequest) => Promise<Combo | null>;
        updateCombo: (request: ComboRequest) => Promise<Combo | null>;
        deleteCombo: (request: ComboRequest) => Promise<Combo | null>;
        getUsers: (user: User) => Promise<User[]>;
        addUser: (request: UserRequest) => Promise<User | null>;
        updateUser: (request: UserRequest) => Promise<User | null>;
        deleteUser: (request: UserRequest) => Promise<User | null>;
        authenticatePIN: (pin: string) => Promise<User | undefined>;
        startSession: (request: StartSessionRequest) => Promise<Session>;
        endSession: (user: User) => Promise<Session>;
        startShift: (user: User) => Promise<Shift>;
        endShift: (user: User) => Promise<Shift>;
        createSale: (sale: Sale) => Promise<number>;
        openDrawer: () => Promise<boolean>;
        getSessions: () => Promise<Session[]>;
        getSalesBySession: (id: number) => Promise<Sale[]>;
    };
}
