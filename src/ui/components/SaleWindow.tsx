import { useState, useEffect } from "react";
import styles from "./styles/SaleWindow.module.css";
import TicketControls from "./TicketControls";
import TicketDisplay from "./TicketDisplay";
import SaleItems from "./SaleItems";

export const emptySale: Sale = { total: 0, user_id: 0, time: "", items: [] };

export default function SaleWindow() {
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [sale, setSale] = useState<Sale>(emptySale);
    const [activeItemIndex, setActiveItem] = useState<number | null>(null);

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

    return (
        <div className={styles.saleWindow} onClick={() => setActiveItem(null)}>
            <SaleItems products={products} combos={combos} sale={sale} setSale={setSale}/>
            <div className={styles.rightContainer}>
                <TicketDisplay
                    sale={sale}
                    products={products}
                    activeItemIndex={activeItemIndex}
                    setActiveItem={setActiveItem}
                />
                <TicketControls
                    sale={sale}
                    setSale={setSale}
                    activeItemIndex={activeItemIndex}
                    setActiveItem={setActiveItem}
                />
            </div>
        </div>
    );
}
