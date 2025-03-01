const BASE_URL = 'http://localhost:8000/api/v1/tags';

export async function getAllTags(sessionToken: string) {
  const response = await fetch(`${BASE_URL}/view_all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  return response.json();
}

export async function createTag(
  userId: string,
  tagName: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({ user_id: userId, name: tagName }),
  });

  return response.json();
}

export async function deleteTag(tagId: string, sessionToken: string) {
  try {
    const response = await fetch(`${BASE_URL}/delete/${tagId}`, {
      method: 'DELETE',
      headers: {
        'session-token': sessionToken,
      },
    });

    if (!response.ok) {
      console.error(`Error al eliminar el tag ${tagId}:`, response.status);
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en deleteTag:', error);
    throw error;
  }
}

export async function updateTag(
  tagId: string,
  newName: string,
  sessionToken: string
) {
  try {
    const response = await fetch(`${BASE_URL}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'session-token': sessionToken,
      },
      body: JSON.stringify({ tag_id: tagId, name: newName }),
    });

    if (!response.ok) {
      console.error(`Error al actualizar el tag ${tagId}:`, response.status);
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateTag:', error);
    throw error;
  }
}

export async function getNotesByTag(tagId: string, sessionToken: string) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/notes/filter_by_tag?tag_id=${tagId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'session-token': sessionToken,
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `No se encontraron notas para el tag ${tagId}:`,
        await response.text()
      );
      return [];
    }

    const notesForTag = await response.json();
    return notesForTag.map(
      (noteWrapper: { note: { id: any; title: any; content: any } }) => ({
        id: noteWrapper.note.id,
        title: noteWrapper.note.title,
        content: noteWrapper.note.content,
      })
    );
  } catch (error) {
    console.error(`Error al obtener notas para el tag ${tagId}:`, error);
    return [];
  }
}
