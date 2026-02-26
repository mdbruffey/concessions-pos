import { useState } from "react";
import styles from "./styles/ProductCard.module.css"
import POSButton from "../POSButton";

type ProductCardProps = {
    product: Product;
    user: User;
    edit: () => void;
}
export default function ProductCard({product, user, edit}: ProductCardProps) {
    const [p, setP] = useState<Product>(product);
    return (
        <div className={styles.card}>
            <div>{p.name}</div>
            <div>{`$${p.default_price}`}</div>
            <POSButton label="Edit" onClick={edit}/>
            <label>
                {`Active: `}
                <input
                    type="checkbox"
                    checked={p.active ? true : false}
                    value={p.name}
                    onChange={() => {
                        const updated = {
                                ...p,
                                active: p.active ? 0 : 1,
                            };
                        setP(updated);
                        window.electron.updateProduct({user: user, product: updated});
                    }}
                />
            </label>
        </div>
    );
}