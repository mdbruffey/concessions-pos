import styles from "./styles/TicketDisplay.module.css";

type TicketDisplayProps = {
    products: Product[];
    sale: Sale;
};

export default function TicketDisplay({ sale, products }: TicketDisplayProps) {
    return (
        <div className={styles.ticketContainer}>
            Current Ticket
            {sale && <div className={styles.itemList}>{sale.items.map((item) => {
                return (
                    <div className={styles.saleItem}>
                        <div>{products.filter((p) => p.id === item.product_id)[0].name} x{item.quantity}</div>
                        <div>${(item.sale_price*item.quantity).toFixed(2)}</div>
                    </div>
                )
            })}</div>}
            Total: ${sale?.items.reduce((count, item) => count + item.sale_price*item.quantity, 0).toFixed(2)}
        </div>
    );
}
