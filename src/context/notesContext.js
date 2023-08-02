import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { initialNotesState, notesReducerFunction } from "../reducer";
import { useAuth } from "./authContext";
import { getNotesService } from "../services";
import { toast } from "react-toastify";

const NotesContext = createContext(initialNotesState);

const NotesProvider = ({ children }) => {
    const {isAuth} = useAuth();

    const fetchNotes = async (authToken) => {
        try {
            const {data : {notes}} = await getNotesService(authToken)
            notesDispatch({
                action: {
                    type: "SET_NOTES_SUCCESS",
                    payload: {
                        notes,
                        notesLoading: false,
                        notesError: null,
                        showNewNoteForm: false,
                        isEditing: false,
                        editingNoteId: -1,
                    },
                },
            })
        }
        catch (error) {
            notesDispatch({
                action: {
                    type: "SET_NOTES_ERROR",
                    payload: {
                        notesLoading: false,
                        notesError: "Could not load notes. Try again later",
                        showNewNoteForm: false,
                        isEditing: false,
                        editingNoteId: -1,               
                    },
                },
            })
            toast("Failed to load notes. Try again later.", "error")
        }
    }

    useEffect(() => {
        const authToken = localStorage.getItem("token")
        if(authToken || isAuth) {
            fetchNotes(authToken);
        }
    }, [isAuth])

    const [notesState, notesDispatch] = useReducer(notesReducerFunction, initialNotesState)

    const [showSidebar, setShowSidebar] = useState(false)

    const handleShowSidebar = () => {
        setShowSidebar((prevShowSidebar) => !prevShowSidebar)
    }

    return (
        <NotesContext.Provider value={{ ...notesState, showSidebar, handleShowSidebar, notesDispatch}}>
                {children}
        </NotesContext.Provider>
    )  
}

const useNotes = () => useContext(NotesContext)

export {NotesProvider, useNotes} 