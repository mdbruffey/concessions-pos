import "./App.css";
import MenuBar from "./components/MenuBar";
import SaleWindow from "./components/SaleWindow";

function App() {
    return (
        <div className={"main_container"}>
            <MenuBar />
            <SaleWindow/>
        </div>
    );
}

export default App;
