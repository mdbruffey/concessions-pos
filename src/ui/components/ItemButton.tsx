import styles from "./styles/ItemButton.module.css"

type ItemButtonProps = {
    product: Product
}

export default function ItemButton({product}: ItemButtonProps){
    return (
        <button className={styles.itemButton}>{product.name}</button>
    )
}