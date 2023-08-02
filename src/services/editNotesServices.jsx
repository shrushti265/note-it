import axios from 'axios';

const editNotesService = (note, token) =>  axios.post(`/api/notes/${note._id}`, { note }, { headers: { authorization: token } });

export { editNotesService };

