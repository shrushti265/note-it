import { NotesList, SearchBar } from "../../components"
import { useNotes } from "../../context"
import {getFilteredAndSortedNotes} from "utils"

const Home = () => {
    const {notes, notesLoading, notesError, SearchText, FilterByLabel, sortBy} = useNotes()

    const loadingMessage = notesLoading && (
        <div className="message">
            <p className="success-color text-lg my-1">Loading Notes...</p>
        </div>
    )

    const errorMessage = notesError && (
        <div className="message">
            <p className="error-color text-lg my-1">{notesError}</p>
        </div>
    )

    const filteredAndSortedNotes = getFilteredAndSortedNotes(notes, SearchText, FilterByLabel, sortBy)
    return (
        <section className="section-wrapper flex-col flex-align-center flex-justify-center flex-justify-start">
            notesStateLoading ? (
                loadingMessage
                ) : notesStateError ? (
                    errorMessage 
                ): (
                    <>
                    <SearchBar />
                    <div className="notes-list-wrapper">
                        {filteredAndSortedNotes.length ? (<NotesList notes={filteredAndSortedNotes}/>) : (<p classname="text-lg text-center">You don't have any notes</p>)}
                    </div>
                    </>
                )
        </section>
    )
}
export {Home}