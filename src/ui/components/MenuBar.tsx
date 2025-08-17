import styles from "./styles/MenuBar.module.css"
import POSButton from "./POSButton"

type MenuBarProps = {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function MenuBar({users, setUsers}: MenuBarProps){
    return <div className={styles.menuBar}>
        <POSButton label="Clock In/Out" onClick={() => console.log("clock in/out clicked")}/>
    </div>
}