import { useState } from "react";
import styles from "./styles/ProductCard.module.css"
import POSButton from "../POSButton";

type ProductCardProps = {
    product: Product;
    user: User;
}
export default function ProductCard({product, user}: ProductCardProps) {
    const [p, setP] = useState<Product>(product);
    return (
        <div className={styles.card}>
            <div>{p.name}</div>
            <div>{`$${p.default_price}`}</div>
            <POSButton label="Edit" onClick={() => null}/>
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