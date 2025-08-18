import { useState } from "react";
import "./App.css";
import MenuBar from "./components/MenuBar";
import SaleWindow from "./components/SaleWindow";

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [session, setSession] = useState<Session | null>(null);

    return (
        <div className={"main_container"}>
            <MenuBar
                users={users}
                setUsers={setUsers}
                session={session}
                setSession={setSession}
            />
            <SaleWindow
                users={users}
                session={session}
            />
        </div>
    );
}

export default App;
