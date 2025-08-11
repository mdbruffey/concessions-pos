import { useState, useEffect } from "react";
import styles from "./styles/SaleWindow.module.css";
import TicketControls from "./TicketControls";
import TicketDisplay from "./TicketDisplay";
import ItemButton from "./ItemButton";

export default function SaleWindow() {
    const emptySale: Sale = { total: 0, user_id: 0, time: "", items: [] };
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [sale, setSale] = useState<Sale | null>(null);

    useEffect(() => {
        window.electron
            .getProducts()
            .then((products) => {
                setProducts(products);
            })
            .catch((error) => {
                throw new Error(error);
            });
        window.electron
            .getCombos()
            .then((combos) => {
                setCombos(combos);
            })
            .catch((error) => {
                throw new Error(error);
            });
    }, []);

    const productButtons = products.map((p) => <ItemButton item={p} />);
    const comboButtons = combos.map((c) => <ItemButton item={c} />);

    return (
        <div className={styles.saleWindow}>
            <div className={styles.saleItems}>{comboButtons}{productButtons}</div>
            <div className={styles.rightContainer}>
                <TicketDisplay sale={sale} products={products} />
                <TicketControls />
            </div>
        </div>
    );
}
