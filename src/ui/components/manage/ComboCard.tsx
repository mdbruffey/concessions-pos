import { useState } from "react";
import styles from "./styles/ProductCard.module.css"
import POSButton from "../POSButton";

type ComboCardProps = {
    combo: Combo;
    user: User;
    edit: () => void;
}
export default function ComboCard({combo, user, edit}: ComboCardProps) {
    const [c, setC] = useState<Combo>(combo);
    return (
        <div className={styles.card}>
            <div>{c.name}</div>
            <div>{`$${c.default_price}`}</div>
            <POSButton label="Edit" onClick={edit}/>
            <label>
                {`Active: `}
                <input
                    type="checkbox"
                    checked={c.active ? true : false}
                    value={c.name}
                    onChange={() => {
                        const updated = {
                                ...c,
                                active: c.active ? 0 : 1,
                            };
                        setC(updated);
                        window.electron.updateCombo({user: user, combo: updated});
                    }}
                />
            </label>
        </div>
    );
}