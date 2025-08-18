import styles from "./styles/MenuBar.module.css"
import POSButton from "./POSButton"
import { useState } from "react";
import ClockModal from "./ClockModal";

type MenuBarProps = {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function MenuBar({users, setUsers}: MenuBarProps){
    const [showClockModal, setShowClockModal] = useState<boolean>(false)

    return <div className={styles.menuBar}>
        <POSButton label="Clock In/Out" onClick={() => setShowClockModal(true)}/>
        {showClockModal && 
        <ClockModal users={users} setUsers={setUsers}/>}
    </div>
}