const BASE_URL = 'http://localhost:8000/api/v1/inventory';

export async function getAllInventoryItems(sessionToken: string) {
  const response = await fetch(`${BASE_URL}/view_all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error(
      'Error en la API de inventario:',
      response.status,
      await response.text()
    );
    return [];
  }

  return response.json();
}

export async function getInventoryItem(
  inventoryId: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL}/view/${inventoryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error(
      `Error al obtener el producto ${inventoryId}:`,
      response.status,
      await response.text()
    );
    return null;
  }

  return response.json();
}

export async function createInventoryItem(
  userId: string,
  productName: string,
  amount: number,
  expirationDate: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      user_id: userId,
      product_name: productName,
      amount,
      expiration_date: expirationDate,
    }),
  });

  return response.json();
}

export async function updateInventoryItem(
  inventoryId: string,
  productName: string,
  amount: number,
  expirationDate: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      inventory_id: inventoryId,
      product_name: productName,
      amount,
      expiration_date: expirationDate,
    }),
  });

  if (!response.ok) {
    console.error(
      `Error al actualizar el producto ${inventoryId}:`,
      response.status,
      await response.text()
    );
    return null;
  }

  return response.json();
}

export async function deleteInventoryItem(
  inventoryId: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL}/delete/${inventoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error(
      `Error al eliminar el producto ${inventoryId}:`,
      response.status,
      await response.text()
    );
    return null;
  }

  return response.json();
}
