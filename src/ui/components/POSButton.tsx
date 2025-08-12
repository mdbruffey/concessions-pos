import styles from "./styles/POSButton.module.css";

type ItemButtonProps = {
    label: string;
    imagePath?: string;
    className?: string;
    onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
};

export default function POSButton({
    label,
    className,
    onClick,
}: ItemButtonProps) {
    return (
        <button
            onClick={(e) => e.stopPropagation()}
            className={(className ? className + " " : "") + styles.itemButton}
            onPointerDown={(e) => e.currentTarget.classList.add("pressed")}
            onPointerUp={(e) => {
                e.currentTarget.classList.remove("pressed");
                onClick(e);
            }}
            onPointerLeave={(e) => e.currentTarget.classList.remove("pressed")}
        >
            {label}
        </button>
    );
}
