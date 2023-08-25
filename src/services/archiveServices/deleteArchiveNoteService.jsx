import axios from "axios";

const deleteArchiveNoteService = (id, token) => 
    axios.delete(`/api/archives/delete/${id}`,
    {headers: {authorization: token},
})

export {deleteArchiveNoteService}