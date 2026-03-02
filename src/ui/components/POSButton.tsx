import styles from "./styles/POSButton.module.css";

type ItemButtonProps = {
    label: string;
    imagePath?: string;
    className?: string;
    backgroundColor?: string;
    onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
};

export default function POSButton({
    label,
    className,
    backgroundColor,
    onClick,
}: ItemButtonProps) {
    let style = {};
    if (backgroundColor) style = { backgroundColor: backgroundColor };
    return (
        <button
            style={style}
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
