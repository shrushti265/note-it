const getSortedNotes = (filteredNotes, sortBy) => {
  const { sortByDate, sortByPriority } = sortBy;

  if (sortByDate === "" && sortByPriority === "") return filteredNotes;

  const notesSortedByDate = getNotesSortedByDate(filteredNotes, sortByDate);
  const notesSortedByPriority = getNotesSortedByPriority(
    filteredNotes,
    sortByPriority
  );

  return notesSortedByPriority;
};

const getNotesSortedByDate = (notes, sortByDate) => {
  if (sortByDate === "") return notes;

  if (sortByDate === "Newest First") {
    return notes.sort(
      (note1, note2) =>
        new Date(note2.noteCreactedOn) - new Date(note1.noteCreactedOn)
    );
  }
  return notes.sort(
    (note1, note2) =>
      new Date(note1.noteCreactedOn) - new Date(note2.noteCreactedOn)
  );
};

const mapPriorities = (priority, sortByPriority) => {
  switch (priority) {
    case "HIGHNONE":
    case "HIGHLOW":
    case "HIGHMEDIUM":
    case "MEDIUMNONE":
    case "MEDIUMLOW":
    case "LOWNONE":
      return sortByPriority === "High to Low" ? -1 : 1;

    default:
      return sortByPriority === "High to Low" ? 1 : -1;
  }
};

const getNotesSortedByPriority = (notes, sortByPriority) => {
  if (sortByPriority === "") return notes;

  return notes.sort((note1, note2) => {
    if (note1.notePriority === note2.notePriority) return 0;

    return mapPriorities(
      note1.notePriority.toUpperCase() + note2.notePriority.toUpperCase(),
      sortByPriority
    );
  });
};
export { getSortedNotes };
