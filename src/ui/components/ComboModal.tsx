import { useState, useEffect } from "react";
import POSButton from "./POSButton";
import styles from "./styles/ComboModal.module.css";

type ComboModalProps = {
    combo: Combo;
    editItem: SaleItem | null;
    products: Product[];
    setSale: React.Dispatch<React.SetStateAction<Sale>>;
    closeModal: () => void;
};

export default function ComboModal({
    combo,
    products,
    editItem,
    setSale,
    closeModal,
}: ComboModalProps) {
    const emptyComboItem: SaleItem = {
        product_id: null,
        combo_id: combo.id,
        quantity: 1,
        sale_price: combo.default_price,
        price_modified: false,
        price_modified_by: null,
        combo_items: [],
    };
    const [comboItem, setComboItem] = useState<SaleItem>(
        editItem ? editItem : emptyComboItem
    );

    const addItemToCombo = (item: Product, slot: number) => {
        const comboItems = comboItem.combo_items;
        const newItem: ComboItem = {
            product_id: item.id,
            option_type: item.combo_option_type,
            quantity: 1,
        };
        const existingItems = comboItems.filter(
            (i) => i.option_type === item.combo_option_type
        );
        if (!existingItems.length) {
            comboItems.push(newItem);
        } else if (
            item.combo_option_type === "main" &&
            existingItems.length >= slot
        ) {
            comboItems[slot - 1] = newItem;
        } else if (item.combo_option_type === "main") {
            comboItems.push(newItem);
        } else {
            const oldIndex = comboItems.findIndex(
                (i) => i.option_type === item.combo_option_type
            );
            comboItems[oldIndex] = newItem;
        }
        comboItems.sort((a, b) => {
            const order = { main: 0, chips: 1, drink: 2 };
            type OrderKeys = "main" | "chips" | "drink";
            return (
                order[a.option_type as OrderKeys] -
                order[b.option_type as OrderKeys]
            );
        });
        setComboItem((prev) => {
            return { ...prev, combo_items: comboItems };
        });
    };

    const mainItems = products.filter((i) =>
        i.type.includes(combo.main_item_type)
    );

    useEffect(() => {
        if(editItem){
            setComboItem(editItem);
        }
        if (mainItems.length === 1) {
            for (let i = 0; i < combo.main_item_quantity; i++) {
                addItemToCombo(mainItems[0], i + 1);
            }
        }
    }, []);

    const chipOptionButtons = products
        .filter((i) => i.combo_option_type === "chips")
        .map((p, i) => (
            <POSButton
                label={p.name}
                className={
                    comboItem.combo_items.find((i) => i.product_id === p.id)
                        ? styles.selected
                        : ""
                }
                onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                    addItemToCombo(p, 1);
                    e.currentTarget.blur();
                }}
                key={i}
            />
        ));
    const drinkOptionButtons = products
        .filter((i) => i.combo_option_type === "drink")
        .map((p, i) => (
            <POSButton
                label={p.name}
                className={
                    comboItem.combo_items.find((i) => i.product_id === p.id)
                        ? styles.selected
                        : ""
                }
                onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                    addItemToCombo(p, 1);
                    e.currentTarget.blur();
                }}
                key={i}
            />
        ));

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h2>Combo Selection: {combo.name}</h2>
                <div className={styles.mainItemContainer}>
                    {Array(combo.main_item_quantity)
                        .fill(0)
                        .map((_, i) => {
                            return (
                                <div className={styles.container}>
                                    <span>Main Item #{i + 1}</span>
                                    <div>
                                        {mainItems.map((p, j) => (
                                            <POSButton
                                                label={p.name}
                                                className={
                                                    comboItem.combo_items[i] &&
                                                    comboItem.combo_items[i]
                                                        .product_id === p.id
                                                        ? styles.selected
                                                        : ""
                                                }
                                                onClick={(e) => {
                                                    addItemToCombo(p, i + 1);
                                                    e.currentTarget.blur();
                                                }}
                                                key={j}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className={styles.container}>
                    Chips
                    <div>{chipOptionButtons}</div>
                </div>
                <div className={styles.container}>
                    Drink
                    <div>{drinkOptionButtons}</div>
                </div>
                <div className={styles.buttonContainer}>
                    <POSButton label="Cancel" onClick={(_) => closeModal()} />
                    <POSButton
                        label="Add"
                        className={
                            comboItem.combo_items.length ===
                            combo.main_item_quantity + 2
                                ? ""
                                : "disabled"
                        }
                        onClick={() => {
                            setSale((prev) => {
                                const items = [...prev.items];
                                items.push(comboItem);
                                return { ...prev, items: items };
                            });
                            closeModal();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
