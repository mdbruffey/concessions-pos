import { useState } from "react";
import "./App.css";
import MenuBar from "./components/MenuBar";
import SaleWindow from "./components/SaleWindow";

function App() {
    const [users, setUsers] = useState<User[]>([]);

    return (
        <div className={"main_container"}>
            <MenuBar users={users} setUsers={setUsers}/>
            <SaleWindow users={users}/>
        </div>
    );
}

export default App;
