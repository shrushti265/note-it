import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { initialNotesState, notesReducerFunction } from "../reducer";
import { useAuth } from "./authContext";
import { getNotesService, getArchivedNotesService, getTrashedNotesService } from "../services";
import { toast } from "react-toastify";


const NotesContext = createContext(initialNotesState);

const NotesProvider = ({ children }) => {
    const {isAuth} = useAuth();
    const [searchText, setSearchText] = useState(" ")
    const [showSidebar, setShowSidebar] = useState(false)

    const fetchNotes = async (authToken) => {
        try {
            const {data : {notes}} = await getNotesService(authToken);
            const {data: {archives}} = await getArchivedNotesService(authToken);
            const {data : {trash}} = await getTrashedNotesService(authToken)

            notesDispatch({
                action: {
                    type: "INIT_NOTES_STATE_SUCCESS",
                    payload: {
                        notes, 
                        archives,
                        notesStateLoading: false,
                        notesStateError: null,
                        showNewNoteForm: false,
                        isEditing: null,
                        editingNoteId: -1,
                        labels: [],
                        trash,
                    }
                }
            })
        }
        catch (error) {
            notesDispatch({
                action: {
                    type: "INIT_NOTES_STATE_SUCCESS",
                    payload: {
                        showNewNoteForm: false,
                        isEditing: null,
                        editingNoteId: -1,  
                        notesStateError: "Couldn't load notes",
                        notesStateLoading: false,            
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
    }, [isAuth]);

    const [notesState, notesDispatch] = useReducer(notesReducerFunction, initialNotesState);

    useEffect(() => {
        const newFilterByLabels = notesState.labels.map(( {label, id} ) => {
            const foundLabel = notesState.filterByLabels.find((filter) => filter.id === id);
            return foundLabel ? foundLabel : {id, label, filtered: false};
        });
        notesDispatch ({
            action: {
                type: "FILTER_BY_LABELS",
                payload: {
                    filterByLabels: newFilterByLabels
                }
        }
        })
    }, [notesState.labels]);

    const handleShowSidebar = () => {
        setShowSidebar((prevShowSidebar) => !prevShowSidebar)
    }

    const handleChangeSearchText = (event) => setSearchText(event.target.value);

    return (
        <NotesContext.Provider value={{ ...notesState, showSidebar, handleShowSidebar, notesDispatch, searchText, handleChangeSearchText}}>
                {children}
        </NotesContext.Provider>
    )  
}

const useNotes = () => useContext(NotesContext)


export {NotesProvider, useNotes} 