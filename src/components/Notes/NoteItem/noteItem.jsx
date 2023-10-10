import TextareaAutosize from "react-textarea-autosize";
import {
  PushPinOutlined,
  PushPin,
  Edit,
  Archive,
  Delete,
  Palette,
  Unarchive,
  Label,
  RestoreFromTrash,
  DeleteForever,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth, useNotes } from "../../../context";
import {
  deleteNotesService,
  postArchiveService,
  postUnarchiveService,
  deleteArchiveNoteService,
  restoreTrashedNoteService
} from "../../../services";
import { toast } from "react-toastify";
import { ColorPalette, LabelOptions } from "../../../components";

const NoteItem = ({ note }) => {
  const { _id, noteTitle, noteBody, noteCreatedOn, isArchived, tags } = note;

  const initialShowOptions = {
    showColorPalette: false,
    showLabelOptions: false,
  };
  const [showOptions, setShowOptions] = useState({
    showColorPalette: false,
    showLabelOptions: false,
  });

  const [pinned, setPinned] = useState(false);

  const { showColorPalette, showLabelOptions } = showOptions;

  const { authToken } = useAuth();
  const { notesDispatch, trash } = useNotes();

  const itemInTrash = trash.find((note) => note._id === _id)

  const handleEditNote = () => {
    notesDispatch({
      action: {
        type: "SHOW_NEW_NOTES_FORM",
        payload: {
          showNewNoteForm: true,
          isEditing: isArchived ? "archive" : "note",
          editingNoteId: _id,
        },
      },
    });
  };

  const handleChangeOptions = (option) => {
    switch (option) {
      case "colorPalette":
        setShowOptions((prevShowOptions) => ({
          ...initialShowOptions,
          showColorPalette: !prevShowOptions.showColorPalette,
        }));
        break;
      case "labelOptions":
        setShowOptions((prevShowOptions) => ({
          ...initialShowOptions,
          showLabelOptions: !prevShowOptions.showLabelOptions,
        }));
        break;
    }
  };

  const handleDeleteArchivedNote = async () => {
    try {
      const {
        data: { archives, trash },
      } = await deleteArchiveNoteService(_id, authToken);
      notesDispatch({
        action: {
          type: "EDIT_ARCHIVES",
          payload: {
            archives,
            trash,
            showNewNote: false,
            isEditing: null,
            editingNoteId: -1,
          },
        },
      });
      toast("Note deleted.", "success");
    } catch (error) {
      console.log(error);
      toast("Could note delete note. Try again after sometime!", "error");
    }
  };

  const handleArchiveNote = async () => {
    try {
      const {
        data: { notes, archives },
      } = isArchived
        ? await postUnarchiveService(note, authToken)
        : await postArchiveService(note, authToken);

      toast(isArchived ? "Note unarchived" : "Note archived", "success");
      notesDispatch({
        action: {
          type: "SET_ARCHIVES",
          payload: {
            notes,
            archives,
          },
        },
      });
    } catch (error) {
      toast(
        isArchived
          ? "Note could not be unarchived. Try again later"
          : "Note could not be archived. Try again later",
        "error"
      );
    }
  };

  const handleDeleteNote = async () => {
    if (isArchived) return handleDeleteArchivedNote();
    try {
      const { data: {notes} } = await deleteNotesService(_id, authToken);
      notesDispatch({
        action: {
          type: "SET_NOTES",
          payload: {
            notes: notes,
            trash: trash,
            notesError: null,
            notesLoading: false,
            showNewNote: false,
            isEditing: false,
            editingNoteId: -1,
          },
        },
      });
      toast("Note deleted.", "success");
    } catch (error) {
      toast("Could not delete note. Try again!", "error");
    }
  };

  const pinIcon = pinned ? <PushPin /> : <PushPinOutlined/>
  const archiveIcon = isArchived ? <Unarchive /> : <Archive />;

  const mappedTags = tags.length > 0 && (
    <div className="notes-tag-list flex-row flex-align-center flex-justify-start flex-wrap">
      {tags.map(({ label, id }) => (
        <span className="badge badge-primary py-0-25 px-0-5 text-sm" key={id}>
          {label}
        </span>
      ))}
    </div>
  );

  const handleRestoreTrashedNote = async () => {
    try {
      const {
        data: {trash, notes, archives}
      } = await restoreTrashedNoteService (_id, authToken);

      notesDispatch({
        action: {
          type: "RESTORE_FROM_TRASH",
          payload: {trash, notes, archives}
        }
      })
    toast("Restored note from trash.", "success");
  } catch (error) {
    toast("Could not restore note from trash. Try again later.", "error");
  }
  }

  const handleDeleteTrashedNoteForever = async () => {
        try {
          const {
            data : {trash},
          } = await restoreTrashedNoteService (_id, authToken);

          notesDispatch({
            action: {
              type: "SET_TRASH",
              payload: {trash},
            }
          })
          toast("Deleted note from trash", "success")
        }catch (error) {
          toast ("Could not delete note from trash. Try again later.",
          "error")
        }
  }

  const trashNoteActions = () => {
        <div className="note-actions flex-row flex-justify-center flex-align-center flex-wrap">
            <button
              className="btn btn-icon btn-note-action"
              onClick={handleRestoreTrashedNote}
            >
              <span className="icon mui-icon icon-restore-trash">
                {<RestoreFromTrash />}
              </span>
            </button>
            <button 
               className="btn btn-icon btn-note-action"
               onClick={handleDeleteTrashedNoteForever}
            >
              <span className="icon mui-icon icon-delete-forever">
                {<DeleteForever />}
              </span>
            </button>
        </div>
  }

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
      {mappedTags}
      <div className="note-info flex-row flex-align-center flex-justify-between">
        <div className="note-timestamp text-sm gray-color">
          Created on {noteCreatedOn}
        </div>
        { itemInTrash ? isArchived && (<p className="text-sm gray-color">Archived Note</p>) : null}
        {itemInTrash ? ( trashNoteActions ) :
        ( 
        <div className="note-actions flex-row flex-justify-center flex-align-center">
          <button
            className="btn btn-icon btn-note-action"
            onClick={handleEditNote}
          >
            <span className="icon mui-icon icon-edit">{<Edit />}</span>
          </button>
          <div className="note-action-wrapper">
            <button
              className="btn btn-icon btn-note-action"
              onClick={() => handleChangeOptions("colorPalette")}
            >
              <span className="icon mui-icon icon-edit">{<Palette />}</span>
            </button>
            {showColorPalette && <ColorPalette />}
          </div>
          <button
            className="btn btn-icon btn-note-action"
            onClick={handleArchiveNote}
          >
            <span className="icon mui-icon icon-edit">{archiveIcon}</span>
          </button>
          <button
            className="btn btn-icon btn-note-action"
            onClick={handleDeleteNote}
          >
            <span className="icon mui-icon icon-edit">{<Delete />}</span>
          </button>
        </div>
          )
        }
      </div>
    </div>
  );
};

export { NoteItem };
