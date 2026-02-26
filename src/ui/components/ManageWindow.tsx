import styles from "./styles/ManageWindow.module.css";
import KeypadModal from "./KeypadModal";
import { useState, useEffect } from "react";
import POSButton from "./POSButton";
import ProductCard from "./manage/ProductCard";
import ComboCard from "./manage/ComboCard";
import Modal from "./Modal";

export default function ManageWindow() {
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const [showKeypad, setShowKeypad] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [activeEdit, setActiveEdit] = useState<Product | Combo | null>(null);

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
            if(activeUser){
                window.electron
                    .getUsers(activeUser)
                    .then((users) => {
                        setUsers(users);
                    })
                    .catch((error) => {
                        throw new Error(error);
                    });
            }
        }, [activeUser]);
    
    const productCards = products
        .sort((a, b) => {
            if (a.active !== b.active) return b.active - a.active;
            const order = ["chips", "drink", "hot"];
            let aVal = order.findIndex((o) => a.type.includes(o));
            let bVal = order.findIndex((o) => b.type.includes(o));
            return bVal - aVal;
        })
        .map((p, i) => {
            return (
                <ProductCard
                    product={p}
                    user={activeUser!} //revisit the ! here.
                    edit={() => setActiveEdit(p)}
                    key={i}
                /> 
            );
        });
    
    const comboCards = combos.map((c, i) => {
        return (
            <ComboCard
                combo={c}
                user={activeUser!} //revisit the ! here.
                edit={() => setActiveEdit(c)}
                key={i}
            />
        );
    })

    const userCards = users.map((u, i) => {
        return (
            <div key={i}>{`ID: ${u.id} | Name: ${u.first_name} ${u.last_name}`}</div>
        )
    })

    return (
        <div className={styles.main}>
            <h2>Manage Database</h2>
            {showKeypad && (
                <KeypadModal
                    header="Login"
                    setCurrentUser={setActiveUser}
                    close={() => setShowKeypad(false)}
                />
            )}
            {activeUser ? (
                <div className={styles.sectionContainer}>
                    <div>
                        <h3>Products</h3>
                        <div className={styles.products}>{productCards}</div>
                        <POSButton label="Add Item" onClick={() => null}/>
                    </div>
                    <div>
                        <h3>Combos</h3>
                        <div className={styles.combos}>{comboCards}</div>
                        <POSButton label="Add Combo" onClick={() => null}/>
                    </div>
                    <div>
                        <h3>Users</h3>
                        <div className={styles.users}>{userCards}</div>
                        <POSButton label="Add User" onClick={() => null}/>
                    </div>
                </div>
            ) : (
                <div className={styles.login}>
                    <POSButton
                        label="Login"
                        onClick={() => setShowKeypad(true)}
                    />
                </div>
            )}
            {activeEdit && (
                <Modal content={<></>} close={() => setActiveEdit(null)}/>
            )}
        </div>
    );
}
