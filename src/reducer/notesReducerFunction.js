import { v4 as uuid } from "uuid";
import { notesActions as actionTypes } from "./actions";
// import {notePriorities} from "components/Notes/note-priorities"

const initialNotesState = {
  notes: [],
  archives: [],
  Labels: [],
  trash: [],
  notesStateLoading: true,
  notesStateError: null,
  showNewNoteForm: false,
  isEditing: null,
  sortBy: {sortByDate: '', sortByPriority: ''},
  editingNoteId: -1,
  filterByLabels: [],
  filterByPriority:
  notePriorities.map(({ priorityId, priority }) => ({
    id: priorityId,
    priority,
    filtered: false,
  })),
};

const notesReducerFunction = (
  prevNotesState,
  {
    action: {
      type,
      payload: {
        notes,
        notesStateLoading,
        notesStateError,
        showNewNoteForm,
        isEditing,
        editingNoteId,
        archives,
        labels,
        label,
        labelId,
        filterByLabel,
        sortBy,
        trash,
        filterByPriority
      },
    },
  }
) => {
  switch (type) {
    case actionTypes.SET_NOTES:
      return {
        ...prevNotesState,
        notes,
        trash: trash || prevNotesState.trash,
        showNewNoteForm,
        isEditing,
        editingNoteId,
      };
    case actionTypes.INIT_NOTES_STATE_SUCCESS:
      return {
        ...prevNotesState,
        notes,
        archives,
        notesStateLoading,
        notesstateError,
        showNewNoteForm,
        isEditing,
        editingNoteId,
        labels,
        trash,
      };

    case actionTypes.INIT_NOTES_STATE_ERROR:
      return {
        ...initialNotesState,
        showNewNoteForm,
        isEditing,
        editingNoteId,
        notesStateLoading,
        notesStateError,
      };
      
    case actionTypes.RESET_NOTES:
      return initialNotesState;

    case actionTypes.SHOW_NEW_NOTE_FORM:
      return {
        ...prevNotesState,
        isEditing,
        editingNoteId,
        showNewNoteForm,
      };

    case actionTypes.SET_ARCHIVES:
      return {
        ...prevNotesState,
        notes,
        archives,
      };

    case actionTypes.EDIT_ARCHIVES:
      return {
        ...prevNotesState,
        archives,
        isEditing,
        editingNoteId,
        showNewNoteForm,
        trash: (trash || prevNotesState.trash),
      };

    case actionTypes.ADD_LABEL:
      return {
        ...prevNotesState,
        labels: [...prevNotesState.labels, { label, id: labelId }],
      };

    case actionTypes.FILTER_BY_LABELS:
      return {
        ...prevNotesState,
        filterByLabel,
      };

    case actionTypes.SORT_BY:
      return {
        ...prevNotesState,
        sortBy,
      };
    case actionTypes.RESET_FILTERS:
      return {
        ...prevNotesState,
        filterByLabel,
        sortBy,
        filterByPriority
      };

    case actionTypes.RESTORE_FROM_TRASH:
      return {
        ...prevNotesState,
        notes,
        archives,
        trash,
      };

    case actionTypes.SET_TRASH:
      return {
        ...prevNotesState,
        trash,
      };

    case actionTypes.FILTER_BY_PRIORITY:
      return {
        ...prevNotesState,
        filterByPriority
      }  

    default:
      throw new Error("Invalid Dispatch action type!");
  }
};

export { notesReducerFunction, initialNotesState };
