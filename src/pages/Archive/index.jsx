import { NotesList, SearchBar } from "components";
import { useNotes } from "../../context";
import { getFilteredAndSortedNotes } from "utils";

const Archive = () => {
  const { 
    archives, 
    notesStateError, 
    notesStateLoading, 
    searchText,
    sortBy,
    filterByLabel,
    filterByPriority, 
} = useNotes();
    

  const loadingMessage = (
    <div className="message">
      <p className="success-color text-lg my-1">Loading Archived Notes...</p>
    </div>
  );
  const errorMessage = (
    <div className="message">
      <p className="error-color text-lg my-1">{notesStateError}</p>
    </div>
  );

  return (
    <section className="section-wrapper flex-col flex-align-center flex-justify-start">
      {
                notesStateLoading ? (
                    loadingMessage
                ) : notesStateError ? (
                    errorMessage
                ) : (
                    <>
                        { archives.length > 0 && <SearchBar noteType="archives" /> }
                        <div className="notes-list-wrapper">
                            {
                                filteredAndSortedArchives.length ? 
                                    <NotesList notes={filteredAndSortedArchives} />
                                : (
                                    <p className="text-lg text-center">
                                        You don't have any archived notes!
                                    </p>
                                )
                            }
                        </div>
                    </>
			    )
            }
    </section>
  );
};

export { Archive };
