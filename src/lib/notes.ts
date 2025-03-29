export const BASE_URL_N = `${import.meta.env.PUBLIC_BASE_URL}/note`;



export async function getAllNotes(sessionToken: string) {
  const response = await fetch(`${BASE_URL_N}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error('Error al obtener notas:', response.status);
    return [];
  }

  const data = await response.json();
  return data.notes || [];
}


export async function getNoteById(noteId: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_N}/${noteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error en getNoteById", data)
  }

  return data;
}


export async function createNote(title: string, content: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_N}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({ title, content }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error en createNote:", data);
  }

  return data;
}



export async function linkNoteToTag(noteId: string, tagId: string, sessionToken: string) {
  if (!noteId || !tagId) {
    console.error("Error: UUID inválido al agregar tag a la nota:", { noteId, tagId });
    return;
  }

  const response = await fetch(`${BASE_URL_N}/add-tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      note_uuid: noteId,
      tags: [tagId],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error en linkNoteToTag:", data);
  }

  return data;
}


export async function removeTagFromNote(noteId: string, tagId: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_N}/remove-tag`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({ note_uuid: noteId, tag_uuid: tagId }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Error en removeTagFromNote:", data);
  }
  return data;
}



export async function updateNote(note_uuid: string, title: string, content: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_N}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({ note_uuid, title, content }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error en updateNote:", data);
  }

  return data;
}

export async function deleteNote(note_uuid: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_N}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({ note_uuid }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error en deleteNote:", data);
  }

  return data;
}



