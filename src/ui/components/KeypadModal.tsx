import { useState } from "react";
import POSButton from "./POSButton";
import styles from "./styles/KeypadModal.module.css";

type KeypadProps = {
    users: User[]
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    close: () => void;
}

export default function KeypadModal({setCurrentUser, close}: KeypadProps){
    const [pin, setPin] = useState<string>("");
    const keysDisabled = pin.length >= 4 ? " disabled" : ""
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h2>Clock In/Out</h2>
                <POSButton label="🗙" className={styles.close} onClick={close}/>
                <input type="password" value={pin} readOnly={true}/>
                <div className={styles.keypad}>
                    {Array(9)
                        .fill(0)
                        .map((_, i) => i + 1)
                        .map((l) => {
                            const label = l.toString();
                            return (
                                <POSButton
                                    label={label}
                                    className={
                                        styles.keypadButton + keysDisabled
                                    }
                                    onClick={() =>
                                        setPin((prev) => prev + label)
                                    }
                                    key={l}
                                />
                            );
                        })}
                    <POSButton
                        label="<"
                        className={styles.backspace}
                        onClick={() =>
                            setPin((prev) => prev.slice(0, prev.length - 1))
                        }
                    />
                    <POSButton
                        label="0"
                        className={styles.keypadButton + keysDisabled}
                        onClick={() => setPin((prev) => prev + "0")}
                    />
                    <POSButton
                        label="Enter"
                        className={pin.length === 4 ? "" : "disabled"}
                        onClick={async () => {
                            const user = await window.electron.authenticatePIN(pin)
                            if(user){
                                setCurrentUser(user);
                                close()
                            }
                            
                        }}
                    />
                </div>
            </div>
        </div>
    );
}