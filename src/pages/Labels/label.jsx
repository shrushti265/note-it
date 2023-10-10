import {useNotes} from "../../context/index"
import {NotesList} from "../../components/index"
import "./label.css"

const Labels = () => {

    const {labels, notes, archives} = useNotes();

    const labelledNotes = labels.map(({label, id}) => {
        const notesWithLabel = notes.reducer(
            (notesAccum, currentNote) => 
            currentNote.tags.find((tag) => tag.id === id)
            ? [...notesAccum, currentNote]
            : [...notesAccum],
        []
        );
        const archivesWithLabel = archives.reduce(
            (archiveAccum, currentNotes) => 
            currentNotes.tags.find((tag) => tag.id === id)
            ? [...archiveAccum, currentNotes]
            : [...archiveAccum],
            []
        )
        return { id, label, notesWithLabel, archivesWithLabel };
    })
    return (
		<section className="section-wrapper flex-col flex-align-center flex-justify-start labels-section">
			{labelledNotes.length ? (
				labelledNotes.map(
					({ label, notesWithLabel, id, archivesWithLabel }) => (
						<div
							className="label-list-wrapper mx-auto text-left"
							id={id}
							key={id}
						>
							<h3 className="label-head mb-0-25">{label}</h3>
							{notesWithLabel.length > 0 ? (
								<div className="note-list-wrapper">
									{<NotesList notes={notesWithLabel} />}
								</div>
							) : (
								<p>
									You don't have any notes under this label!
								</p>
							)}
							{archivesWithLabel.length > 0 && (
								<div className="archived-list-wrapper my-1-5">
									<h6 className="label-sub-head mb-0-75">
										Archived
									</h6>

									{<NotesList notes={archivesWithLabel} />}
								</div>
							)}
						</div>
					)
				)
			) : (
				<p className="text-lg text-center">You have not created any labels!</p>
			)}
		</section>
	);
}

export { Labels };