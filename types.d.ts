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
};

type Combo = {
    id: number;
    name: string;
    main_item_type: string;
    main_item_quantity: number;
    default_price: number;
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

type EventPayloadMapping = {
    getProducts: {
        request: undefined;
        response: Product[];
    };
    getCombos: {
        request: undefined;
        response: Combo[];
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
    }
    endShift: {
        request: User;
        response: Shift;
    }
    createSale: {
        request: Sale;
        response: number;
    };
};

interface Window {
    electron: {
        getProducts: () => Promise<Product[]>;
        getCombos: () => Promise<Combo[]>;
        authenticatePIN: (pin: string) => Promise<User | undefined>;
        startSession: (request: StartSessionRequest) => Promise<Session>;
        endSession: (user: User) => Promise<Session>;
        startShift: (user: User) => Promise<Shift>;
        endShift: (user: User) => Promise<Shift>;
        createSale: (sale: Sale) => Promise<number>;
    };
}
