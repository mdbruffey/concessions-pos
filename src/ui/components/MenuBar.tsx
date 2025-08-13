import styles from "./styles/MenuBar.module.css"
import POSButton from "./POSButton"

export default function MenuBar(){
    return <div className={styles.menuBar}>
        <POSButton label="Clock In/Out" onClick={() => console.log("clock in/out clicked")}/>
    </div>
}