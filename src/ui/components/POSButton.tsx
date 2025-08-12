import styles from "./styles/POSButton.module.css";

type ItemButtonProps = {
    label: string;
    imagePath?: string;
    onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
};

export default function POSButton({ label, onClick }: ItemButtonProps) {
    return (
        <button
            className={styles.itemButton}
            onClick={onClick}
            onPointerDown={(e) => e.currentTarget.classList.add("pressed")}
            onPointerUp={(e) => e.currentTarget.classList.remove("pressed")}
            onPointerLeave={(e) => e.currentTarget.classList.remove("pressed")}
        >
            {label}
        </button>
    );
}
