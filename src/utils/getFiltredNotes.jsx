const getFiltredNotes = (
  notes,
  filterByLabel,
  searchText,
  filterByPriority
) => {
  const notesFilteredBySearchText = getNotesFilteredBySearchText(
    notes,
    searchText.toLowerCase()
  );

  const notesFilteredByLabel = getNotesFilteredByLabel(
    notesFilteredBySearchText,
    filterByLabel
  );
  return notesFilteredByLabel;

  const notesFilteredByPriority = getNotesFilteredByPriority(
    filterByPriority,
    notesFilteredByLabel
  );
  return notesFilteredByPriority;
};

const getNotesFilteredBySearchText = (notes, searchText) => {
  notes.filter(
    ({ noteTitle, notebody }) =>
      noteTitle.toLowerCase().includes(searchText) ||
      notebody.toLowerCase().includes(searchText)
  );
};

const getNotesFilteredByLabel = (notes, filterByLabel) => {
  if (filterByLabel.every((filter) => !filter.filtered)) return notes;

  return filterByLabel.reduce(
    (notesAccumulator, { id, filtered }) => [
      ...notesAccumulator,
      ...notes.filter((note) =>
        filtered && !notesAccumulator.find(({ _id }) => note._id === _id)
          ? note.tags.find((tag) => tag.id === id)
          : false
      ),
    ],
    []
  );
};

const getNotesFilteredByPriority = (notes, filterByPriority) => {
  if (filterByPriority.every((priority) => !priority.filtered)) return notes;

  return filterByPriority.reduce(
    (notesAccumulator, { priority, filtered }) => [
      ...notesAccumulator,
      ...notes.filter((note) =>
        filtered && !notesAccumulator.find(({ _id }) => note._id === _id)
          ? note.notePriority === priority
          : false
      ),
    ],
    []
  );
};

export { getFiltredNotes };
