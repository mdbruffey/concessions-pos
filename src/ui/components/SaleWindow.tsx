import { useState, useEffect } from "react";
import styles from "./styles/SaleWindow.module.css";
import TicketControls from "./TicketControls";
import TicketDisplay from "./TicketDisplay";
import SaleItems from "./SaleItems";
import ComboModal from "./ComboModal";
import CheckoutModal from "./CheckoutModal";

export const emptySale: Sale = { total: 0, user_id: 1, time: "", items: [] };

type SaleWindowProps = {
    users: User[]
    session: Session | null;
}

export default function SaleWindow({users, session}: SaleWindowProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [sale, setSale] = useState<Sale>(emptySale);
    const [activeItemIndex, setActiveItem] = useState<number | null>(null);

    const [showComboModal, setShowComboModal] = useState<boolean>(false);
    const [activeCombo, setActiveCombo] = useState<Combo | null>(null);
    const [editingCombo, setEditingCombo] = useState<SaleItem | null>(null);

    const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

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

    const createComboModal = (combo: Combo, editItem?: SaleItem) => {
        if(editItem) setEditingCombo(editItem)
        setActiveCombo(combo);
        setShowComboModal(true);
    }

    return (
        <div className={styles.saleWindow} onClick={() => setActiveItem(null)}>
            {showComboModal && activeCombo && (
                <ComboModal
                    combo={activeCombo}
                    editItem={editingCombo}
                    closeModal={() => {
                        setShowComboModal(false);
                        setActiveCombo(null);
                    }}
                    products={products}
                    setSale={setSale}
                />
            )}
            {showCheckoutModal && (
                <CheckoutModal
                    sale={sale}
                    setSale={setSale}
                    users={users}
                    setShowCheckoutModal={setShowCheckoutModal}
                />
            )}
            {session ? (
                <>
                    <SaleItems
                        products={products}
                        combos={combos}
                        sale={sale}
                        setSale={setSale}
                        createComboModal={createComboModal}
                    />
                    <div className={styles.rightContainer}>
                        <TicketDisplay
                            sale={sale}
                            products={products}
                            combos={combos}
                            activeItemIndex={activeItemIndex}
                            setActiveItem={setActiveItem}
                        />
                        <TicketControls
                            sale={sale}
                            setSale={setSale}
                            activeItemIndex={activeItemIndex}
                            combos={combos}
                            setActiveItem={setActiveItem}
                            modifyCombo={createComboModal}
                            setShowCheckoutModal={setShowCheckoutModal}
                        />
                    </div>
                </>
            ) : (
                <div>You must start a session to make sales.</div>
            )}
        </div>
    );
}