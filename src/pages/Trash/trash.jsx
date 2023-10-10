import { NotesList } from "../../components";
import { useNotes } from "../../context";

const Trash = () => {

    const {trash, notesStateError, notesStateLoading} = useNotes();

    const loadingMessage = (
        <div className="message">
            <p className="success-color text-lg my-1">
                Loading Trashed Notes...
            </p>
        </div>
    );

    const errorMessage = (
        <div className="message">
            <p className="error-color text-lg my-1">
                {notesStateError}
            </p>
        </div>
    );

    return (
        <section className="section-wrapper flex-col flex-align-center flex-justify-start">
            {notesStateLoading ? (loadingMessage) : notesStateError ? (errorMessage) : (
                <div className="notes-list-wrapper">
                    {
                        Trash.length ? 
                        <NotesList notes={trash}/>
                        :
                        <p className="text-lg text-center">
                            You don't have any notes in Trash!
                        </p>
                    }
                </div>
            )}
        </section>
    )
}

export { Trash };