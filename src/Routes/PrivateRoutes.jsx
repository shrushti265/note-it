
import { Login } from "../pages";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./../components";
import { useAuth } from "../context";

const PrivateRoutes = () => {
	const {authState: { isAuth }} = useAuth();

	return isAuth ? (
		<main className="grid-container">
			<Sidebar className="sidebar" />
			<Outlet />
		</main>
	) : (
		<Navigate to="/login" />
	);
};

export { PrivateRoutes };