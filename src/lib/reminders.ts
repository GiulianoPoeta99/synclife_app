export const BASE_URL_R = `${import.meta.env.PUBLIC_BASE_URL}/reminder`;

export async function getAllReminders(sessionToken: string) {
  const response = await fetch(`${BASE_URL_R}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error('Error al obtener recordatorios:', response.status);
    return [];
  }

  const data = await response.json();
  return data;
}

export async function getReminder(reminderId: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_R}/${reminderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error(`Error al obtener el recordatorio ${reminderId}:`);
    return null;
  }

  const data = await response.json();
  return data.reminder;
}

export async function createReminder(
  reminderName: string,
  reminderDate: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL_R}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      title: reminderName,
      remind_date: reminderDate,
    }),
  });

  if (!response.ok) {
    console.error('Error al crear el recordatorio:', response.status);
    return null;
  }

  const data = await response.json();
  return data.reminder;
}

export async function updateReminder(
  reminderId: string,
  reminderName: string,
  reminderDate: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL_R}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      reminder_uuid: reminderId,
      title: reminderName,
      remind_date: reminderDate,
    }),
  });

  if (!response.ok) {
    console.error('Error al actualizar el recordatorio:', response.status);
    return null;
  }

  const data = await response.json();
  return data.reminder;
}

export async function deleteReminder(reminderId: string, sessionToken: string) {
  const response = await fetch(`${BASE_URL_R}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      reminder_uuid: reminderId,
    }),
  });

  if (!response.ok) {
    console.error('Error al eliminar el recordatorio:', response.status);
    return null;
  }

  const data = await response.json();
  return data;
}
