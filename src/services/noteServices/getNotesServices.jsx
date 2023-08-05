import axios from 'axios';

const getNotesService = (note, token) =>  axios.get('/api/notes/', { headers: { authorization: token } });

export { getNotesService };