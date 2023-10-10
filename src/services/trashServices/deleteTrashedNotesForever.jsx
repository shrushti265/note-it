import axios from "axios"

const deleteTrashedNotesForever = (token, noteId) => {
    axios.delete(`/trash/delete/${noteId}`, {headers: {authorization: token}})
}

export {deleteTrashedNotesForever}