import styles from "./styles/EditItem.module.css";
import { isProduct } from "../../utils";
import POSButton from "../POSButton";

type EditItemProps = {
    item: Product | Combo;
    setItem: React.Dispatch<React.SetStateAction<Product | Combo | null>>;
    user: User | null;
};

export default function EditItem({ item, setItem, user }: EditItemProps) {

    function handleChange(field: keyof (Product & Combo), value: any) {
        const newItem = { ...item, [field]: value };
        setItem(newItem);
    }

    function submitProduct(product: Product, user: User){
        if (product.id < 0) {
            //new product
            window.electron
                .addProduct({ product: product, user: user })
                .then(() => setItem(null));
        } else {
            window.electron
                .updateProduct({ product: product, user: user })
                .then(() => setItem(null));
        }
    }
    
    function submitCombo(combo: Combo, user: User) {
        if (combo.id < 0) {
            //new combo
            window.electron
                .addCombo({ combo: combo, user: user })
                .then(() => setItem(null));
        } else {
            window.electron
                .updateCombo({ combo: combo, user: user })
                .then(() => setItem(null));
        }
    }

    if (isProduct(item)) {
        return (
            <div className={styles.container}>
                <h2>{item.id >= 0 ? "Edit" : "Add"} Product</h2>
                <label>
                    Name
                    <input
                        type="text"
                        id="name"
                        value={item.name}
                        onChange={(e) =>
                            e && handleChange("name", e.target.value)
                        }
                    />
                </label>
                <label>
                    Type
                    <input
                        type="text"
                        id="type"
                        value={item.type}
                        onChange={(e) =>
                            e && handleChange("type", e.target.value)
                        }
                    />
                </label>
                <label>
                    Combo Option Type
                    <input
                        type="text"
                        id="combo_option_type"
                        value={item.combo_option_type}
                        onChange={(e) =>
                            e &&
                            handleChange("combo_option_type", e.target.value)
                        }
                    />
                </label>
                <label>
                    Default Price
                    <input
                        type="number"
                        id="default_price"
                        value={item.default_price}
                        onChange={(e) =>
                            e &&
                            handleChange(
                                "default_price",
                                Number(e.target.value),
                            )
                        }
                    />
                </label>
                <POSButton label="Confirm" onClick={() => submitProduct(item, user!)} />
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <h2>{item.id >= 0 ? "Edit" : "Add"} Combo</h2>
            <label>
                Name
                <input
                    type="text"
                    id="name"
                    value={item.name}
                    onChange={(e) => e && handleChange("name", e.target.value)}
                />
            </label>
            <label>
                Main Item
                <input
                    type="text"
                    id="main_item_type"
                    value={item.main_item_type}
                    onChange={(e) =>
                        e && handleChange("main_item_type", e.target.value)
                    }
                />
            </label>
            <label>
                Main item Quantity
                <input
                    type="number"
                    id="name"
                    value={item.main_item_quantity}
                    onChange={(e) =>
                        e &&
                        handleChange(
                            "main_item_quantity",
                            Number(e.target.value),
                        )
                    }
                />
            </label>
            <label>
                Default Price
                <input
                    type="number"
                    id="default_price"
                    value={item.default_price}
                    onChange={(e) =>
                        e &&
                        handleChange("default_price", Number(e.target.value))
                    }
                />
            </label>
            <POSButton label="Confirm" onClick={() => submitCombo(item, user!)} />
        </div>
    );
}
