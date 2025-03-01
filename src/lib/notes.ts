const BASE_URL = "http://localhost:8000/api/v1/notes";

export async function getAllNotes(sessionToken: string) {
  const response = await fetch(`${BASE_URL}/view_all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "session-token": sessionToken,
    }
  });

  if (!response.ok) {
    console.error("Error en la API de notas:", response.status, await response.text());
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}


export async function createNote(
  userId: string,
  title: string,
  content: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "session-token": sessionToken,
    },
    body: JSON.stringify({ user_id: userId, title, content }),
  });

  return response.json();
}

export async function linkNoteToTag(noteId: string, tagId: string, sessionToken: string) {
  await fetch(`${BASE_URL}/add_tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "session-token": sessionToken,
    },
    body: JSON.stringify({ note_id: noteId, tags: [tagId] }),
  });
}

export async function updateNote(
  noteId: string,
  title: string,
  content: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "session-token": sessionToken, 
    },
    body: JSON.stringify({ 
      note_id: noteId,
      title, 
      content 
    }),
  });

  if (!response.ok) {
    console.error("Error al actualizar la nota:", response.status, await response.text());
    return null;
  }

  return response.json();
}

export async function deleteNote(noteId: string, sessionToken: string) {
  const inventoryId = "default";
  const url = `${BASE_URL}/delete/${inventoryId}?note_id=${encodeURIComponent(noteId)}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "session-token": sessionToken,
    },
  });

  if (!response.ok) {
    console.error("Error al eliminar la nota:", response.status, await response.text());
    return null;
  }

  return response.json();
}





