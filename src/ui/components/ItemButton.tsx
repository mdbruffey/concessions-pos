import styles from "./styles/ItemButton.module.css"

type ItemButtonProps = {
    item: Product | Combo;
}

export default function ItemButton({item}: ItemButtonProps){
    return (
        <button className={styles.itemButton}>{item.name}</button>
    )
}