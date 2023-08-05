import axios from "axios"

const deleteNotesService = ( id, token ) => {
    return axios.delete(`/api/notes/${id}`, {headers : {authorization: token}}) 
}

export {deleteNotesService};