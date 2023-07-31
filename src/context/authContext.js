import { createContext , useContext, useEffect, useReducer } from "react";
import { initialAuthState, authReducerFunction } from "reducer"

const AuthContext = createContext(initialAuthState);

const AuthProvider = ({children}) => {
    const getInitialAuthState = () => {
        const authToken = localStorage.getItem("token");
        const authUser = localStorage.getItem("user"); 
        
        if(authToken){
            return {
                authToken,
                authUser,
                authError: false,
                authLoading: false,
                isAuth: true
            }
        }
        return initialAuthState;
    }
    const [authState, authDispatch] = useReducer(authReducerFunction, getInitialAuthState());

    return <AuthContext.Provider value={{authDispatch, authState}}>
            {children}
    </AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export {AuthProvider, useAuth};