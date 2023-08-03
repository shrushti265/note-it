import "notes.css"
import {NotesItem} from "../NoteItem"

const NotesList = ({notes}) => {
    return (
        <article className="notes-container flex-col flex-align-center flex-justify-start mx-auto">
            {
                notes.map(notes => <NotesItem key={notes._id} note={note}/>)
            }
        </article>
    )
}
export {NotesList}