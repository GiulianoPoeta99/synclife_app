import { BASE_URL_N } from './notes';
export const BASE_URL_T = `${import.meta.env.PUBLIC_BASE_URL}/tag`;

export async function getAllTags(sessionToken: string) {
  const response = await fetch(`${BASE_URL_T}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  const data = await response.json();
  return data.tags || [];
}

export async function createTag(name: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_T}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({ name }),
  });

  return response.json();
}

export async function getTagById(tagId: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_T}/${tagId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  const data = await response.json();
  return data.tag;
}

export async function deleteTag(tagId: string, sessionToken: string) {
  try {
    const response = await fetch(`${BASE_URL_T}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'session-token': sessionToken,
      },
      body: JSON.stringify({ tag_uuid: tagId }),
    });

    if (!response.ok) {
      console.error(`Error al eliminar el tag ${tagId}:`, response.status);
      throw new Error(await response.text());
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
    const response = await fetch(`${BASE_URL_T}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'session-token': sessionToken,
      },
      body: JSON.stringify({ tag_uuid: tagId, name: newName }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateTag:', error);
    throw error;
  }
}
export async function getNotesByTag(tagId: string, sessionToken: string) {
  try {
    const response = await fetch(`${BASE_URL_N}/filter-by-tag/${tagId}`, {
      method: 'GET',
      headers: {
        'session-token': sessionToken,
      },
    });

    if (!response.ok) {
      console.warn('No se encontraron notas:', await response.text());
      return [];
    }

    const data = await response.json();
    return data.notes || [];
  } catch (error) {
    console.error('Error en getNotesByTag:', error);
    return [];
  }
}
