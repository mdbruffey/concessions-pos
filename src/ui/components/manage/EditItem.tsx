import { useState } from "react";
import styles from "./styles/EditItem.module.css";
import { isProduct } from "../../utils";
import POSButton from "../POSButton";

type EditItemProps = {
    editItem: Product | Combo;
};

export default function EditItem({ editItem }: EditItemProps) {
    const [item, setItem] = useState(editItem);

    function handleChange(field: keyof (Product & Combo), value: any) {
        const newItem = { ...item, [field]: value };
        setItem(newItem);
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
                <POSButton label="Confirm" onClick={() => null} />
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
            <POSButton label="Confirm" onClick={() => null} />
        </div>
    );
}
