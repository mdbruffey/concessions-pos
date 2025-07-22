type User = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    pin: number;
};

type Product = {
    id: number;
    name: string;
    type: string;
    default_price: number;
    image_path: string | null;
};

type Combo = {
    id: number;
    name: string;
    default_price: number;
    items: { product: Product; quantity: number }[];
};

type Sale = {
    id?: number;
    total: number;
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
};

type Session = {
    id?: number;
    start: string;
    started_by: number;
    end: string | null;
    ended_by: number | null;
    description: string | null;
    sales: Sale[];
};

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
        request: number;
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
    createSale: {
        request: Sale;
        response: number;
    };
};

interface Window {
    electron: {
        getProducts: () => Promise<Product[]>;
        getCombos: () => Promise<Combo[]>;
        authenticatePIN: (pin: number) => Promise<User | undefined>;
        startSession: (request: StartSessionRequest) => Promise<Session>;
        createSale: (sale: Sale) => Promise<number>;
        endSession: (user: User) => Promise<Session>;
    };
}
