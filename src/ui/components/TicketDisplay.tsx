import styles from "./styles/TicketDisplay.module.css";

type TicketDisplayProps = {
    products: Product[];
    sale: Sale | null;
};

export default function TicketDisplay({ sale, products }: TicketDisplayProps) {
    return (
        <div className={styles.ticketContainer}>
            Current Ticket
            {sale && <div className={styles.itemList}>{sale.items.map((item) => {
                return (
                    <div>
                        <div>{products.filter((p) => p.id === item.product_id)[0].name}</div>
                        <div>{item.sale_price}</div>
                    </div>
                )
            })}</div>}
        </div>
    );
}
