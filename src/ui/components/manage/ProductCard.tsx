import { useState } from "react";
import styles from "./styles/ProductCard.module.css"

type ProductCardProps = {
    product: Product;
    user: User;
}
export default function ProductCard({product, user}: ProductCardProps) {
    const [p, setP] = useState<Product>(product);
    return (
        <div className={styles.card}>
            <div>{p.name}</div>
            <div>{`Price: $${p.default_price}`}</div>
            <label>
                {`Active: `}
                <input
                    type="checkbox"
                    checked={p.active ? true : false}
                    onChange={(e) => {
                        setP((prev) => {
                            return {
                                ...prev,
                                active: !prev.active ? 1:0,
                            };
                        });
                        //window.electron.updateProduct({user: user, product: p});
                    }}
                />
            </label>
        </div>
    );
}