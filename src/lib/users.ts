export const BASE_URL_U = `${import.meta.env.PUBLIC_BASE_URL}/users`;

export async function getUser(sessionToken: string) {
  const response = await fetch(`${BASE_URL_U}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error('Error al obtener el usuario:', response.status);
    return { id: '', name: '', email: '' };
  }

  const data = await response.json();
  return data.user;
}

export async function deleteUser(sessionToken: string) {
  const response = await fetch(`${BASE_URL_U}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    console.error('Error al eliminar el usuario:', response.status);
    return false;
  }

  return true;
}

export async function updateUser(
  firstName: string,
  lastName: string,
  birthDate: string,
  phone: string,
  email: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL_U}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      email,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      phone,
    }),
  });

  if (!response.ok) {
    console.error('Error al actualizar el usuario:', response.status);
    return false;
  }

  return true;
}

export async function updateUserPassword(
  newPassword: string,
  validate_token: string
) {
  const response = await fetch(
    `${BASE_URL_U}/change-password/${validate_token}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_password: newPassword }),
    }
  );

  if (!response.ok) {
    console.error('Error al actualizar la contraseña:', response.status);
    return false;
  }

  return true;
}

export async function requestChangePassword(email: string) {
  const response = await fetch(`${BASE_URL_U}/request-change-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    console.error(
      'Error al solicitar el cambio de contraseña:',
      response.status
    );
    return false;
  }

  return true;
}

export async function verifyAccount(validate_token: string) {
  const response = await fetch(`${BASE_URL_U}/${validate_token}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Error al verificar la cuenta:', response.status);
    return false;
  }

  return true;
}
