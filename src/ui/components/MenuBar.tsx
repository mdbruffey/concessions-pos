import styles from "./styles/MenuBar.module.css"
import POSButton from "./POSButton"
import { useState } from "react";
import KeypadModal from "./KeypadModal";
import UserInfoModal from "./UserInfoModal";

type MenuBarProps = {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>
    page: Page;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

export default function MenuBar({
    users,
    setUsers,
    session,
    setSession,
    page,
    setPage
}: MenuBarProps) {
    const [showKeypadModal, setShowKeypadModal] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const closeKeypad = () => setShowKeypadModal(false);

    return (
        <div className={styles.menuBar}>
            <POSButton
                label="Clock In/Out"
                onClick={() => setShowKeypadModal(true)}
            />
            {showKeypadModal && (
                <KeypadModal
                    users={users}
                    setUsers={setUsers}
                    setCurrentUser={setCurrentUser}
                    close={closeKeypad}
                />
            )}
            {currentUser && (
                <UserInfoModal
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    users={users}
                    setUsers={setUsers}
                    session={session}
                    setSession={setSession}
                />
            )}
            <div className={styles.pageSelect}>
                <POSButton
                    label="Sale"
                    className={page === "sale" ? "selected" : ""}
                    onClick={() => setPage("sale")}
                />
                <POSButton
                    label="Manage"
                    className={page === "manage" ? "selected" : ""}
                    onClick={() => setPage("manage")}
                />
                <POSButton
                    label="Reports"
                    className={page === "reports" ? "selected" : ""}
                    onClick={() => setPage("reports")}
                />
            </div>
        </div>
    );
}