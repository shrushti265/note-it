import TextareaAutosize from "react-textarea-autosize";
import {
	PushPinOutlined,
	PushPin,
	Edit,
	Archive,
	Delete,
	Palette,
} from "@mui/icons-material";
import { useState } from "react";
import {useAuth, useNotes} from "../../../context"
import { deleteNotesService } from "../../../services";
import { toast } from "react-toastify";

const NoteItem = ({note: {_id, noteTitle, noteBody, noteCreatedOn }}) => {
    const [showOptions, setShowOptions] = useState({});

    const [pinned, setPinned] = useState(false);

    const {showColorPalette} = showOptions;

    const {authToken} = useAuth()
    const {notesDispatch} = useNotes()

    const handleEditNote = () => {
        notesDispatch({
            action: {
                type: "SHOW_NEW_NOTES_FORM",
                payload: {
                    showNewNoteForm: true,
                    isEditing: true,
                    editingNoteId: _id
                }
            }
        })
    }

    const handleChangeOptions = ( option ) => {
        switch (option) {
            case "colorPalette":
                setShowOptions((prevShowOptions) => ({
                    ...prevShowOptions,
                    showColorPalette: !prevShowOptions.showColorPalette
                }));
                break;
        }
    }

    const handleDeleteNote = async () => {
        try {
            const {data} = await deleteNotesService(_id, authToken);
            notesDispatch({
                action: {
                    type: "SET_NOTES_SUCCESS",
                    payload : {
                        notes: data.notes,
                        notesError: null,
                        notesLoading: false,
                        showNewNotes: false,
                        isEditing: false,
                        editingNoteId: -1
                    }
                }
            })
            toast("Note deleted.", "success");
        }catch (error) {
            toast(
                "Could not delete note. Try again!",
                "success"
            )
        }
    }

    const pinIcon = pinned ? <PushPin /> : <PushPinOutlined/>

    return (
        <div className={`note note-card p-1 flex-align-start flex-justify-between`}>
            <input 
            type="text"
            value={noteTitle}
            className="note-title p-0-5"
            readOnly
            />
            <TextareaAutosize
				className="note-body p-0-5 pr-0-75"
				value={noteBody}
				readOnly
			/>
            
			<div className="note-info flex-row flex-align-center flex-justify-between">
				<div className="note-timestamp text-sm gray-color">
					Created on {noteCreatedOn}
				</div>
				<div className="note-actions flex-row flex-justify-center flex-align-center">
					<button
						className="btn btn-icon btn-note-action"
						onClick={handleEditNote}
					>
						<span className="icon mui-icon icon-edit">
							{<Edit />}
						</span>
					</button>
					<div className="note-action-wrapper">
						<button
							className="btn btn-icon btn-note-action"
							onClick={() => handleChangeOptions("colorPalette")}
						>
							<span className="icon mui-icon icon-edit">
								{<Palette />}
							</span>
						</button>
						{showColorPalette && <ColorPalette />}
					</div>
					<button className="btn btn-icon btn-note-action">
						<span className="icon mui-icon icon-edit">
							{<Archive />}
						</span>
					</button>
					<button
						className="btn btn-icon btn-note-action"
						onClick={handleDeleteNote}
					>
						<span className="icon mui-icon icon-edit">
							{<Delete />}
						</span>
					</button>
				</div>
            </div>
        </div>
    )
}