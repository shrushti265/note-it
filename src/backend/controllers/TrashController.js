import { Response } from "miragejs";
import { requiresAuth } from "../utils/authUtils";

/**
 * All the routes related to Trash are present here.
 *  These are Privately accessible routes.
 * */

/**
 * This handler handles gets all trashed notes in the db.
 * send GET Request at /api/trash
 * */

export const getAllTrashNotesHandler = function (schema, request) {
  const user = requiresAuth.call(this, request);
  if (!user) {
    return  new Response(
      404,
      {},
      {
        errors: ["The email you entered is not Registered. Not Found error"],
      }
    );
  }
  return new Response(200, {}, { trash: user.trash });
};

/**
 * This handler handles deletes note from trash.
 * send DELETE Request at /api/trash/delete/:noteId
 * */

export const deleteFromTrashHandler = function (schema, request) {
  const user = requiresAuth.call(this, request);
  if (!user) {
   return new Response(
      404,
      {},
      {
        errors: ["The email you entered is not Registered. Not Found error"],
      }
    );
  }
  const { noteId } = request.params;
  user.trash = user.trash.filter((note) => note._id !== noteId);
  this.db.users.update({ _id: user._id }, user);
  return new Response(200, {}, { trash: user.trash });
};

/**
 * This handler handles restoring the trashed notes to user notes.
 * send POST Request at /api/trash/restore/:noteId
 * */

export const restoreFromTrashHandler = function (schema, request) {
  const user = requiresAuth.call(this, request);
  try {
  if (!user) {
    return new Response(
      404,
      {},
      {
        errors: ["The email you entered is not Registered. Not Found error"],
      }
    );
  }
  const { noteId } = request.params;
  const noteToBeRestored = user.trash.find(note => note._id === noteId);
  if(noteToBeRestored.isArchived){
    user.archives.push({...noteToBeRestored})
  }
  else{
    user.notes.push({...noteToBeRestored});
  }
  user.trash = user.trash.filter(note => note._id !== noteId);
  this.db.users.update({ _id: user._id }, user);
  return new Response (201, {}, {notes: user.notes, trash: user.trash, archives: user.archives})
}catch (error){
  return new Response (
    500,
    {},
    {
      error
    }
  )
}
};
