import "../notes.css"
import {NoteItem} from "../../../components"

const NotesList = ({notes}) => {
    const numNotes = notes.length;

    return (
        <article className="notes-container flex-col flex-align-center flex-justify-start mx-auto">
            <p className="text-left">Number of notes: {numNotes}</p>
            {
                notes.map(notes => <NoteItem key={notes._id} note={notes}/>)
            }
        </article>
    )
}
export {NotesList}