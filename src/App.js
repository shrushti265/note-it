import { NavRoutes } from "./Routes/NavRoutes";
import { Navbar, NewNoteModal } from "./components";
import { useAuth } from "./context";

const App = () => {
    
    return (
        <div className="App">
            <Navbar />
            <NewNoteModal/>
            <NavRoutes />
        </div>
    )
}

export default App;