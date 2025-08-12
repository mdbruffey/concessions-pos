import { useState, useEffect } from "react";
import styles from "./styles/SaleWindow.module.css";
import TicketControls from "./TicketControls";
import TicketDisplay from "./TicketDisplay";
import POSButton from "./POSButton";

export default function SaleWindow() {
    const emptySale: Sale = { total: 0, user_id: 0, time: "", items: [] };
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [sale, setSale] = useState<Sale>(emptySale);
    const [activeItemIndex, setActiveItem] = useState<number | null>(null)

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

    const productButtons = products.map((p, i) => (
        <POSButton
            label={p.name}
            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                addProduct(p);
                e.currentTarget.blur();
            }}
            key={i}
        />
    ));
    const comboButtons = combos.map((c, i) => (
        <POSButton label={c.name} onClick={() => {}} key={i}/>
    ));

    const addProduct = (product: Product) => {
        //check if item is already in the sale
        const matchIndex = sale.items.findIndex(
            (item) => item.product_id === product.id
        );
        //if it is, just increment the quantity (but you have to avoid mutating in place...)
        if (matchIndex !== -1) {
            setSale((prev) => {
                const items = [...prev.items];
                const matchedItem = { ...items[matchIndex] };
                matchedItem.quantity += 1;
                items[matchIndex] = matchedItem;
                return { ...prev, items };
            });
        } else {
            const saleItem: SaleItem = {
                product_id: product.id,
                combo_id: null,
                quantity: 1,
                sale_price: product.default_price,
                price_modified: false,
                price_modified_by: null,
                combo_items: [],
            };
            setSale((prev) => {
                return { ...prev, items: [...prev.items, saleItem] };
            });
        }
    };

    return (
        <div 
            className={styles.saleWindow}
            onClick={() => setActiveItem(null)}>
            <div className={styles.saleItems}>
                {comboButtons}
                {productButtons}
            </div>
            <div className={styles.rightContainer}>
                <TicketDisplay 
                    sale={sale} 
                    products={products} 
                    activeItemIndex={activeItemIndex}
                    setActiveItem={setActiveItem}/>
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
