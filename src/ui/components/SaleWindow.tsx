import styles from "./styles/SaleWindow.module.css"
import TicketControls from "./TicketControls"
import TicketDisplay from "./TicketDisplay"

export default function SaleWindow() {
    return (
        <div className={styles.saleWindow}>
            <div className={styles.saleItems}>items</div>
            <div className={styles.rightContainer}>
                <TicketDisplay/>
                <TicketControls/>
            </div>
        </div>
    )
}