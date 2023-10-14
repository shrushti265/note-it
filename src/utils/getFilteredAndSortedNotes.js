import { getFiltredNotes } from "./getFiltredNotes";
import { getSortedNotes } from "./getSortedNotes";


const getFilteredAndSortedNotes = (notes, SearchText, filterByLabel, sortBy, filterByPriority) => {
    const filteredNotes = getFiltredNotes(notes, FilterByLabel, SearchText, filterByPriority);
    const filteredAndSortedNotes = getSortedNotes(notes, sortBy);
    return filteredAndSortedNotes;
}

export {getFilteredAndSortedNotes}