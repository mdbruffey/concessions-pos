import styles from "./styles/TicketDisplay.module.css";

type TicketDisplayProps = {
    products: Product[];
    sale: Sale;
    activeItemIndex: number | null;
    setActiveItem: Function;
};

export default function TicketDisplay({
    sale,
    products,
    activeItemIndex,
    setActiveItem,
}: TicketDisplayProps) {
    return (
        <div 
            className={styles.ticketContainer} 
            onClick={() => setActiveItem(null)}
        >
            <b>Current Ticket</b>
            <div className={styles.itemList}>
                {sale.items.map((item, i) => {
                    return (
                        <div
                            className={
                                styles.saleItem +
                                (activeItemIndex === i ? " " + styles.active : "")
                            }
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(i);
                            }}
                        >
                            <div>
                                {products.filter(
                                        (p) => p.id === item.product_id
                                    )[0].name
                                }{" "}
                                x{item.quantity}
                            </div>
                            <div>
                                ${(item.sale_price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    );
                })}
            </div>
            <b>Total: $
            {sale?.items
                .reduce(
                    (count, item) => count + item.sale_price * item.quantity,0)
                .toFixed(2)}</b>
        </div>
    );
}
