import { useState } from "react";
import POSButton from "./POSButton";
import styles from "./styles/ComboModal.module.css";
import { emptySale } from "./SaleWindow";

type ComboModalProps = {
    combo: Combo;
    editItem?: SaleItem;
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
    const [comboItem, setComboItem] = useState<SaleItem>(editItem ? editItem : emptyComboItem);

    const mainItemButtons = products
        .filter((i) => i.type.includes(combo.main_item_type))
        .map((p, i) => (
            <POSButton
                label={p.name}
                onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                    console.log(`Product ${p.name} clicked.`);
                    e.currentTarget.blur();
                }}
                key={i}
            />
        ));
    const chipOptionButtons = products
        .filter((i) => i.combo_option_type === "chips")
        .map((p, i) => (
            <POSButton
                label={p.name}
                onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                    console.log(`Product ${p.name} clicked.`);
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
                onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                    console.log(`Product ${p.name} clicked.`);
                    e.currentTarget.blur();
                }}
                key={i}
            />
        ));
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h2>Combo Selection</h2>
                <div>{combo.name}</div>
                <div>
                    Main Item
                    {mainItemButtons}
                </div>
                <div>
                    Chips
                    {chipOptionButtons}
                </div>
                <div>
                    Drink
                    {drinkOptionButtons}
                </div>
                <POSButton label="Cancel" onClick={(_) => closeModal()} />
                <POSButton label="Add" onClick={() => {
                    setSale((prev) => {
                        const items = [...prev.items];
                        items.push(comboItem);
                        return {...prev, items: items}
                    })
                    closeModal()
                }} />
            </div>
        </div>
    );
}
