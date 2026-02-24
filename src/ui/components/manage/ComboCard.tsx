import { useState } from "react";
import styles from "./styles/ProductCard.module.css"
import POSButton from "../POSButton";

type ComboCardProps = {
    combo: Combo;
    user: User;
}
export default function ComboCard({combo, user}: ComboCardProps) {
    const [c, setC] = useState<Combo>(combo);
    return (
        <div className={styles.card}>
            <div>{c.name}</div>
            <div>{`$${c.default_price}`}</div>
            <POSButton label="Edit" onClick={() => null}/>
        </div>
    );
}