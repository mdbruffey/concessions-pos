import POSButton from "./POSButton";
import styles from "./styles/UserInfoModal.module.css"

type UserInfoModalProps = {
    currentUser: User;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>
}

export default function UserInfoModal({
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    session,
    setSession
}: UserInfoModalProps){
    const loggedIn = users.find((u) => u.id === currentUser.id) ? true : false;

    let endSession = async (element: EventTarget & HTMLButtonElement) => {
        for (let user of users) {
            await window.electron.endShift(user);
        }
        await window.electron.endSession(currentUser);
        setUsers([]);
        setSession(null);
        element.classList.remove(styles.pressed)
    };
    //I'm not sure what type to use here. It apparently it a number
    //but the function claims to return a NodeJS.Timeout
    let clearTimerID: any;
    return (
        <div className="backdrop">
            <div className={styles.modal}>
                <h2>Welcome {currentUser.first_name}</h2>
                <div>{session ? " Active Session" : "No Active Session"}</div>
                <div className={styles.buttonContainer}>
                    <POSButton
                        label="Begin Session"
                        className={session ? "disabled" : ""}
                        onClick={async () => {
                            const newSession =
                                await window.electron.startSession({
                                    user: currentUser,
                                    description: "",
                                });
                            if (newSession) {
                                setSession(newSession);
                                await window.electron.startShift(currentUser);
                                setUsers((prev) => [...prev, currentUser]);
                            }
                        }}
                    />
                    <button
                        className={session ? styles.end : styles.end + " disabled"}
                        onPointerDown={(e) => {
                            e.currentTarget.classList.add(styles.pressed);
                            const currentTarget = e.currentTarget;
                            clearTimerID = setTimeout(
                                () => endSession(currentTarget),
                                750
                            );
                        }}
                        onPointerUp={(e) => {
                            e.currentTarget.classList.remove(styles.pressed);
                            clearTimeout(clearTimerID);
                        }}
                        onPointerLeave={(e) => {
                            e.currentTarget.classList.remove(styles.pressed);
                            clearTimeout(clearTimerID);
                        }}
                    > End Session
                    </button>
                </div>
                <div>You are {loggedIn ? "" : "not"} logged in.</div>
                <div className={styles.buttonContainer}>
                    <POSButton
                        label="Clock In"
                        className={session && !loggedIn ? "" : "disabled"}
                        onClick={async () => {
                            const response = await window.electron.startShift(
                                currentUser
                            );
                            if (response) {
                                setUsers((prev) => [...prev, currentUser]);
                            }
                        }}
                    />
                    <POSButton
                        label="Clock Out"
                        className={session && loggedIn ? "" : "disabled"}
                        onClick={async () => {
                            const response = await window.electron.endShift(
                                currentUser
                            );
                            if (response) {
                                setUsers((prev) =>
                                    prev.filter((u) => u.id !== currentUser.id)
                                );
                            }
                        }}
                    />
                </div>
                <POSButton label="Exit" onClick={() => setCurrentUser(null)} />
            </div>
        </div>
    );
}