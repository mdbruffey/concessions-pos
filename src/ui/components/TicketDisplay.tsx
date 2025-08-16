import styles from "./styles/TicketDisplay.module.css";

type TicketDisplayProps = {
    products: Product[];
    combos: Combo[];
    sale: Sale;
    activeItemIndex: number | null;
    setActiveItem: Function;
};

export default function TicketDisplay({
    sale,
    products,
    combos,
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
                            <div className={styles.header}>
                                <div>
                                    {item.product_id ? 
                                        products.filter((p) => p.id === item.product_id)[0].name :
                                        combos.filter((c) => c.id ===item.combo_id)[0].name
                                    }{" "}
                                    x{item.quantity}
                                </div>
                                <div>
                                    ${(item.sale_price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                            {item.combo_id && item.combo_items.map((ci) => {
                                return (
                                    <div className={styles.comboItem}>
                                        {products.filter((p) => p.id === ci.product_id)[0].name
                                        }{" "}
                                        x{ci.quantity}
                                    </div>
                                )
                            })
                            }
                            
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
