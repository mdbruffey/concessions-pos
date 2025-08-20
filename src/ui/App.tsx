import { useState } from "react";
import "./App.css";
import MenuBar from "./components/MenuBar";
import SaleWindow from "./components/SaleWindow";
import ManageWindow from "./components/ManageWindow";

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [session, setSession] = useState<Session | null>(null);

    const [page, setPage] = useState<Page>("sale");

    return (
        <div className={"main_container"}>
            <MenuBar
                users={users}
                setUsers={setUsers}
                session={session}
                setSession={setSession}
                page={page}
                setPage={setPage}
            />
            {page === "sale" && 
                <SaleWindow
                    users={users}
                    session={session}
                />
            }
            {page === "manage" && 
                <ManageWindow />
            }
        </div>
    );
}

export default App;
