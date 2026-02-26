import type { ReactNode } from "react";
import styles from "./styles/Modal.module.css";
import POSButton from "./POSButton";

type ModalProps = {
    content: ReactNode;
    close: () => void;
};

export default function Modal({ content, close }: ModalProps) {
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <POSButton label="🗙" className={styles.close} onClick={close} />
                {content}
            </div>
        </div>
    );
}
