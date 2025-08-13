import styles from "./styles/SaleItems.module.css";
import POSButton from "./POSButton";

type SaleItemsProps = {
    products: Product[];
    combos: Combo[];
    sale: Sale;
    setSale: React.Dispatch<React.SetStateAction<Sale>>;
};

export default function SaleItems({
    products,
    combos,
    sale,
    setSale,
}: SaleItemsProps) {
    const hotButtons = products.filter((i) => i.type.includes("hot")).map((p, i) => (
        <POSButton
            label={p.name}
            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                addProduct(p);
                e.currentTarget.blur();
            }}
            key={i}
        />
    ));

    const drinkButtons = products.filter((i) => i.type.includes("drink")).map((p, i) => (
        <POSButton
            label={p.name}
            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                addProduct(p);
                e.currentTarget.blur();
            }}
            key={i}
        />
    ));

    const frozenButtons = products.filter((i) => i.type.includes("frozen")).map((p, i) => (
        <POSButton
            label={p.name}
            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                addProduct(p);
                e.currentTarget.blur();
            }}
            key={i}
        />
    ));
    const chipButtons = products.filter((i) => i.type.includes("chip")).map((p, i) => (
        <POSButton
            label={p.name}
            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                addProduct(p);
                e.currentTarget.blur();
            }}
            key={i}
        />
    ));
    const candyButtons = products.filter((i) => i.type.includes("candy")).map((p, i) => (
        <POSButton
            label={p.name}
            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                addProduct(p);
                e.currentTarget.blur();
            }}
            key={i}
        />
    ));
    const specialButtons = products.filter((i) => i.type.includes("special")).map((p, i) => (
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
        <POSButton label={c.name} onClick={() => {}} key={i} />
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
        <div className={styles.saleItems}>
            <div className={styles.combos}>
                <b>Combos</b>
                <div className={styles.buttonContainer}>{comboButtons}</div>
            </div>
            <div className={styles.hotFood}>
                <b>Hot Food</b>
                <div className={styles.buttonContainer}>{hotButtons}</div>
            </div>
            <div className={styles.coldFood}>
                <b>Ice Cream</b>
                <div className={styles.buttonContainer}>{frozenButtons}</div>
            </div>
            <div className={styles.drinks}>
                <b>Drinks</b>
                <div className={styles.buttonContainer}>{drinkButtons}</div>
            </div>
            <div className={styles.chips}>
                <b>Chips</b>
                <div className={styles.buttonContainer}>{chipButtons}</div>
            </div>
            <div className={styles.candy}>
                <b>Candy</b>
                <div className={styles.buttonContainer}>{candyButtons}</div>
            </div>
            <div className={styles.special}>
                <b>Special</b>
                <div className={styles.buttonContainer}>{specialButtons}</div>
            </div>
        </div>
    );
}
