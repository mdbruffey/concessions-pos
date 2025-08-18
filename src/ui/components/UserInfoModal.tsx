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
    return (
        <div className="backdrop">
            <div className={styles.modal}>
                <h2>Welcome {currentUser.first_name}</h2>
                <div>{session ? " Active Session" : "No Active Session"}</div>
                <div className={styles.buttonContainer}>
                    <POSButton
                        label="Begin Session"
                        className={session ? "disabled":""}
                        onClick={async () => {
                            const newSession =
                                await window.electron.startSession({
                                    user: currentUser,
                                    description: "",
                                });
                            if(newSession){
                                setSession(newSession)
                            }
                        }}
                    />
                    <POSButton
                        label="End Session"
                        className={session ? "":"disabled"}
                        onClick={async () => {
                            for(let user of users){
                                await window.electron.endShift(user);
                            }
                            await window.electron.endSession(currentUser);
                            setSession(null);
                        }}
                    />
                </div>
                <div>You are {loggedIn ? "" : "not"} logged in.</div>
                <div className={styles.buttonContainer}>
                    <POSButton
                        label="Clock In"
                        className={session && !loggedIn ? "":"disabled"}
                        onClick={async () => {
                            const response = await window.electron.startShift(currentUser);
                            if(response){
                                setUsers((prev) => [...prev, currentUser])
                            }
                        }}
                    />
                    <POSButton
                        label="Clock Out"
                        className={session && loggedIn ? "":"disabled"}
                        onClick={async () => {
                            const response = await window.electron.endShift(currentUser);
                            if(response){
                                setUsers((prev) => prev.filter((u) => u.id !== currentUser.id))
                            }
                        }}
                    />
                </div>
                <POSButton label="Exit" onClick={() => setCurrentUser(null)} />
            </div>
        </div>
    );
}