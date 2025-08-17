import POSButton from "./POSButton"
import { emptySale } from "./SaleWindow"
import styles from "./styles/CheckoutModal.module.css"

type CheckoutModalProps = {
    sale: Sale
    users: User[];
    setSale: React.Dispatch<React.SetStateAction<Sale>>
    setShowCheckoutModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CheckoutModal({
    sale,
    setSale,
    users,
    setShowCheckoutModal,
}: CheckoutModalProps) {
    const setPaymentType = (paymentType: "cash" | "card" | "tab") => {
        setSale((prev) => {
            return { ...prev, payment_type: paymentType };
        });
    };
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h2>Total</h2>
                <h3>${sale.total.toFixed(2)}</h3>
                Transaction Type
                <div className={styles.buttonContainer}>
                    <POSButton
                        label="Cash"
                        className={
                            sale.payment_type === "cash" ? styles.selected : ""
                        }
                        onClick={() => setPaymentType("cash")}
                    />
                    <POSButton
                        label="Card"
                        className={
                            sale.payment_type === "card" ? styles.selected : ""
                        }
                        onClick={() => setPaymentType("card")}
                    />
                    <POSButton
                        label="Tab"
                        className={
                            sale.payment_type === "tab" ? styles.selected : ""
                        }
                        onClick={() => setPaymentType("tab")}
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <POSButton
                        label="Cancel"
                        onClick={() => setShowCheckoutModal(false)}
                    />
                    <POSButton
                        label="Finish"
                        className={sale.payment_type ? "" : "disabled"}
                        onClick={async () => {
                            try {
                                const finalSale = { ...sale };
                                //this *should* always be true, but just in case, my user (id: 1) is the
                                //default; otherwise the first user in the users list will be used
                                if(users.length){
                                    finalSale.user_id = users[0].id;
                                }
                                const response =
                                    await window.electron.createSale(finalSale);
                                console.log(response);
                            } catch (error) {
                                console.log(error);
                            }
                            setSale(emptySale);
                            setShowCheckoutModal(false);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}