import { useEffect, useState } from "react";
import { useAuth, useNotes } from "../../../context";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import "./newNoteModal.css"
import TextareaAutosize from "react-textarea-autosize";
import { editNotesService, editArchiveService, postNoteService } from "../../../services";
import { toast } from "react-toastify";
import {getCreatedDate} from "utils/getCreatedDate"

const NewNoteModal = () => {
    const {
        notes,
		showNewNoteForm,
		notesDispatch,
		showSidebar,
		handleShowSidebar,
		isEditing,
		editingNoteId,
        archives
    } = useNotes();
    const {authToken} = useAuth()

    const initialEmptyFormState = {
        noteTitle: "",
        noteBody: ""
    }

    const [noteItem, setNoteItem] = useState(initialEmptyFormState)
    const [formDataError, setFormDataError] = useState(null)
    const [pinned, setPinned] = useState(false)

    useEffect(() => {
        if(isEditing === "note")
            setNoteItem(notes.find((note) => note._id === editingNoteId));
        if(isEditing === "archive")
            setNoteItem(archives.find((archive) => archive._id === editingNoteId))
    }, [isEditing])

    const handleAddNotes = async (event) => {
        event.preventDefault();
        if(noteItem.noteTitle === '' || noteItem.noteBody === '')
        setFormDataError("Your note title and body cannot be empty");
        return;
    }
    setFormDataError(null)

    const handlePinnedState = () => {
        setPinned((prevPinnedState) => !prevPinnedState)
    }

    const handleNoteItemChange = ({target: {name, value} }) => {
        return setNoteItem((prevNoteItem) => ({
            ...prevNoteItem,
            [name] : value
        }))
    }

    const resetNoteFormInput = () => {
        if (showSidebar) handleShowSidebar()
        setNoteItem(initialEmptyFormState);
        setFormDataError(null)
    }

    const handleCancelNewNote = () => {
        resetNoteFormInput()
        return notesDispatch({
			action: {
				type: "SHOW_NEW_NOTE_FORM",
				payload: {
					showNewNoteForm: false,
					isEditing: null,
					editingNoteId: -1,
				},
			},
		});
    }

    const handleEditNote = async () => {
        try {
            const {
                data : {notes},
            } = await editNotesService (noteItem, authToken);

            notesDispatch({
                action: {
                    type: "SET_NOTES_SUCCESS",
                    payload: {
                        notes,
                        notesLoading: false,
						notesError: null,
						showNewNoteForm: false,
						isEditing: null,
						editingNoteId: -1,
                    }
                }
            })
            toast("Edited Note", "info");
            resetNoteFormInput();
        }catch (error) {
            notesDispatch({
                action: {
                    type: "SET_NOTES_ERROR",
                    payload: {
                        notesLoading: false,
						showNewNoteForm: false,
						isEditing: null,
						editingNoteId: -1,
						notesError:
							"Could not create a new note. Please try again later.",
                    }
                }
            })
            toast("Failed to edit note. Please try again later", "error")
        }
    }

    const handleEditArchived = async () => {
        try {
            const {data: {archives}} = await editArchiveService (noteItem, authToken)

            notesDispatch({
                action: {
                    type: "EDIT_ARCHIVES",
                    payload: {
                        archives,
                        showNewNoteForm: false,
                        isEditing: null,
                        editingNoteId: -1
                    }
                }
            })
            toast("Edited Note", "info");
            resetNoteFormInput();
        }catch (error){
            toast("Failed to edit note. Please try again", "error")
        }
    }

    if (isEditing) {
        if(noteItem.isArchived){
            return handleEditArchived()
        }
        return handleEditNote();
    }
    try {
        const noteCreatedOn = getCreatedDate();
        const {
            data: { notes },
        } = postNoteService(
            { ...noteItem, noteCreatedOn, isArchived: false },
            { authorization: authToken }
        );

        notesDispatch({
            action: {
                type: "SET_NOTES_SUCCESS",
                payload: {
                    notes,
                    notesLoading: false,
                    notesError: null,
                    showNewNoteForm: false,
                    isEditing: null,
                    editingNoteId: -1,
                },
            },
        });
        toast("Created new note.", "success");
        resetNoteFormInput();
    } catch (error) {
        notesDispatch({
            action: {
                type: "SET_NOTES_ERROR",
                payload: {
                    showNewNoteForm: false,
                    isEditing: null,
                    editingNoteId: -1,
                    notesLoading: false,
                    notesError:
                        "Could not create a new note. Please try again later.",
                },
            },
        });
        toast(
            "Failed to create new note. please try again later.",
            "error"
        );
    }


    const {noteTitle, noteBody} = noteItem
    const pinIcon = pinned ? <PushPin/> : <PushPinOutlined />
    const submitButtonValue = isEditing ? "Edit Note" : "Add Note";

    return (
        <div className="new-note-container flex-col flex-align-center flex-justify-center p-2">
            <form
                onSubmit={handleAddNotes}
                className="new-note-form note-card flex-col flex-align-start flex-justify-between p-1"
            >
                <button
                    type="button"
                    className="btn btn-icon btn-pin"
					onClick={handlePinnedState}
					tabIndex="3"
                >
                    {pinIcon}
                </button>
                <input
                    type="text"
					value={noteTitle}
					name="noteTitle"
					className="note-title p-0-5"
					onChange={handleNoteItemChange}
					tabIndex="1" 
                />
                <TextareaAutosize
					className="note-body p-0-5 multline-textarea"
					value={noteBody}
					name="noteBody"
					onChange={handleNoteItemChange}
					tabIndex="2"
				/>
                <div className="button-container flex-row flex-justify-between flex-align-center mt-1">
					<input
						type="button"
						value="Cancel"
						className="btn btn-primary btn-outline px-0-75 py-0-25"
						onClick={handleCancelNewNote}
						tabIndex="4"
					/>
					<input
						type="submit"
						value={submitButtonValue}
						className="btn btn-primary px-0-75 py-0-25"
						tabIndex="5"
					/>
				</div>
                { formDataError && <p className="text-lg error-color mt-1-5 mx-auto">{formDataError}</p>}
            </form>
        </div>
    )
}

export {NewNoteModal}