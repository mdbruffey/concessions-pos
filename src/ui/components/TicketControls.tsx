import styles from "./styles/TicketControls.module.css";
import POSButton from "./POSButton";

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
    const itemButtonClassName = activeItemIndex !== null ? "" : "disabled ";

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
            <POSButton
                className={itemButtonClassName + styles.decrement}
                label="-"
                onClick={() => {
                    if (activeItemIndex !== null) {
                        decrementItem(activeItemIndex);
                    }
                }}
            />
            <POSButton
                className={itemButtonClassName + styles.increment}
                label="+"
                onClick={() => {
                    if (activeItemIndex !== null) {
                        incrementItem(activeItemIndex);
                    }
                }}
            />
            <POSButton
                className={itemButtonClassName + styles.modify}
                label="Modify"
                onClick={() => {
                    return;
                }}
            />
            <POSButton
                className={styles.checkout}
                label="Checkout"
                onClick={() => {return}}
            />
        </div>
    );
}
