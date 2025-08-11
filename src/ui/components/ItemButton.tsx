import styles from "./styles/ItemButton.module.css"

type ItemButtonProps = {
    item: Product | Combo;
    onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
}

export default function ItemButton({item, onClick}: ItemButtonProps){
    return (
        <button className={styles.itemButton} onClick={onClick}>{item.name}</button>
    )
}