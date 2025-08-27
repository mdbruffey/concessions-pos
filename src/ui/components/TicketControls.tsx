import styles from "./styles/TicketControls.module.css";
import POSButton from "./POSButton";
import { emptySale } from "./SaleWindow";

type TicketControlsProps = {
    sale: Sale;
    setSale: React.Dispatch<React.SetStateAction<Sale>>;
    activeItemIndex: number | null;
    setActiveItem: React.Dispatch<React.SetStateAction<number | null>>;
    combos: Combo[],
    modifyCombo: (combo: Combo, editItem?: SaleItem) => void;
    setShowCheckoutModal: React.Dispatch<React.SetStateAction<boolean>>
};

export default function TicketControls({
    sale,
    setSale,
    activeItemIndex,
    setActiveItem,
    combos,
    modifyCombo,
    setShowCheckoutModal
}: TicketControlsProps) {
    const itemButtonClassName = activeItemIndex !== null ? "" : "disabled ";
    const modifyButtonClassName =
        activeItemIndex !== null && sale.items[activeItemIndex].combo_id
            ? ""
            : "disabled ";

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

    const clearTicket = (element: EventTarget & HTMLButtonElement) => {
        setActiveItem(null);
        setSale(emptySale);
        element.classList.remove(styles.pressed);
    };
    //I'm not sure what type to use here. It apparently it a number
    //but the function claims to return a NodeJS.Timeout
    let clearTimerID: any;
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
                className={modifyButtonClassName + styles.modify}
                label="Modify"
                onClick={() => {
                    if (activeItemIndex !== null) {
                        const comboItem = sale.items[activeItemIndex];
                        const combo = combos.filter(
                            (c) => c.id === comboItem.combo_id
                        )[0];
                        setSale((prev) => {
                            const items = sale.items.filter(
                                (_, i) => i !== activeItemIndex
                            );
                            return { ...prev, items: items };
                        });
                        setActiveItem(null);
                        modifyCombo(combo, comboItem);
                    }
                }}
            />
            <button
                className={
                    styles.clear + (sale.items.length ? "" : " disabled")
                }
                onPointerDown={(e) => {
                    e.currentTarget.classList.add(styles.pressed);
                    const currentTarget = e.currentTarget;
                    clearTimerID = setTimeout(
                        () => clearTicket(currentTarget),
                        500
                    );
                }}
                onPointerUp={(e) => {
                    e.currentTarget.classList.remove(styles.pressed);
                    clearTimeout(clearTimerID);
                }}
                onPointerLeave={(e) => {
                    e.currentTarget.classList.remove(styles.pressed);
                    clearTimeout(clearTimerID);
                }}
            >
                Clear Ticket
            </button>
            <POSButton
                className={styles.checkout}
                label="Checkout"
                onClick={() => {
                    setSale((prev) => {
                        return {
                            ...prev,
                            total: sale.items.reduce(
                                (count, item) =>
                                    count + item.sale_price * item.quantity, 0
                            ),
                        };
                    });
                    setShowCheckoutModal(true);
                }}
            />
        </div>
    );
}
