import { useEffect, useState } from "react";
import styles from "./styles/SessionReportModal.module.css";
import POSButton from "../POSButton";
import { timestampToSessionDate } from "../../utils";

type SessionReportModalProps = {
    session: Session;
    close: () => void;
};

export default function SessionReportModal({
    session,
    close
}: SessionReportModalProps) {
    const [sales, setSales] = useState<Sale[]>([]);
    
    useEffect(() => {
        if(session.id){
            window.electron.getSalesBySession(session.id!)
                .then((sales) => setSales(sales))
                .catch((error) => console.error(error))
        }
    })

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h2>{timestampToSessionDate(session.start)}</h2>
                <div>Number of Sales: {sales.length}</div>
                <POSButton label="Close" onClick={close}/>
            </div>
        </div>
        );
}
