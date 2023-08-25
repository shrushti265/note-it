import { getFiltredNotes } from "./getFiltredNotes";
import { getSortedNotes } from "./getSortedNotes";


const getFilteredAndSortedNotes = (notes, SearchText, FilterByLabel, sortBy) => {
    const filteredNotes = getFiltredNotes(notes, FilterByLabel, SearchText);
    const filteredAndSortedNotes = getSortedNotes(notes, sortBy);
    return filteredAndSortedNotes;
}

export {getFilteredAndSortedNotes}