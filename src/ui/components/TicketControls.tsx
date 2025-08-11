import styles from "./styles/TicketControls.module.css";

type TicketControlsProps = {
    sale: Sale;
    setSale: React.Dispatch<React.SetStateAction<Sale>>;
    activeItemIndex: number | null;
    setActiveItem: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function TicketControls({
    sale,
    setSale,
    activeItemIndex,
    setActiveItem,
}: TicketControlsProps) {
    const itemButtonClassName =
        activeItemIndex !== null ? "" : styles.disabled + " ";

    const decrementItem = (index: number) => {
        const saleItem = { ...sale.items[index] };
        if (saleItem.quantity === 1) {
            setSale((prev) => {
                const items = sale.items.filter((_, i) => i !== index);
                return { ...prev, items: items };
            });
            setActiveItem(null);
        } else {
            saleItem.quantity -= 1;
            const items = [...sale.items];
            items[index] = saleItem;
            setSale((prev) => {
                return { ...prev, items: items };
            });
        }
    };

    const incrementItem = (index: number) => {
        const saleItem = { ...sale.items[index] };
        saleItem.quantity += 1;
        const items = [...sale.items];
        items[index] = saleItem;
        setSale((prev) => {
            return { ...prev, items: items };
        });
    };
    return (
        <div className={styles.controlContainer}>
            <button
                className={itemButtonClassName + styles.decrement}
                onClick={(e) => {
                    e.currentTarget.blur();
                    if (activeItemIndex !== null) {
                        decrementItem(activeItemIndex);
                    }
                }}
            >
                -
            </button>
            <button
                className={itemButtonClassName + styles.increment}
                onClick={(e) => {
                    e.currentTarget.blur();
                    if (activeItemIndex !== null) {
                        incrementItem(activeItemIndex);
                    }
                }}
            >
                +
            </button>
            <button className={itemButtonClassName + styles.modify}>
                Modify
            </button>
            <button className={styles.checkout}>Checkout</button>
        </div>
    );
}
