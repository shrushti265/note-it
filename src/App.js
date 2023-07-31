import { NavRoutes } from "./Routes/NavRoutes";
import { Navbar } from "./components";
import {Sidebar} from "./components"
import { useAuth } from "./context";

const App = () => {

    const {authState : {isAuth} } = useAuth()
    return (
        <div className="App">
            <Navbar />
            <NavRoutes />
            <Sidebar />
        </div>
    )
}

export default App;