import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    const { isAuth } = useAuth();

    return isAuth ? (
        <main className="grid-container">
            <Sidebar className="sidebar"/>
            <Outlet/>
        </main>
    ) : (
        <Navigate to="/login"/>
    )
}

export {PrivateRoutes};